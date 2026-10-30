import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import http from 'node:http'
import { test } from 'node:test'
import worker from '../src/worker.js'

for (const [source, destination] of [
  ['http://www.ktmessenger.com/', 'https://ktmessenger.com/'],
  ['https://www.ktmessenger.com/', 'https://ktmessenger.com/'],
  ['https://www.ktmessenger.com/blog', 'https://ktmessenger.com/blog'],
  ['https://www.ktmessenger.com/blog?source=test', 'https://ktmessenger.com/blog?source=test'],
  ['http://www.ktmessenger.com/hi/blog/post?x=a%2Fb&x=2', 'https://ktmessenger.com/hi/blog/post?x=a%2Fb&x=2'],
  ['https://www.ktmessenger.com//evil.example/%2F?q=https%3A%2F%2Fevil.example', 'https://ktmessenger.com//evil.example/%2F?q=https%3A%2F%2Fevil.example'],
  ['https://www.ktmessenger.com/contact', 'https://ktmessenger.com/contact'],
]) {
  test(`301: ${source}`, async (t) => {
    t.mock.method(globalThis, 'fetch', () => { throw new Error('Redirect must not contact origin') })
    const response = await worker.fetch(new Request(source, {
      headers: { 'x-forwarded-host': 'evil.example', 'x-kt-blog-meta': '1' },
    }))
    assert.equal(response.status, 301)
    assert.equal(response.headers.get('location'), destination)
    assert.equal(await response.text(), '')
  })
}

test('HEAD redirects; canonical destination serves origin without looping', async (t) => {
  const upstream = new Response('homepage', { status: 200 })
  const mock = t.mock.method(globalThis, 'fetch', async () => upstream)
  const redirect = await worker.fetch(new Request('https://www.ktmessenger.com/', { method: 'HEAD' }))
  assert.equal(redirect.status, 301)
  assert.equal(mock.mock.callCount(), 0)
  const result = await worker.fetch(new Request(redirect.headers.get('location')))
  assert.equal(result, upstream)
  assert.equal(result.status, 200)
  assert.equal(mock.mock.callCount(), 1)
})

test('API requests retain method, body, cookies, authorization and response', async (t) => {
  for (const [url, method] of [
    ['https://www.ktmessenger.com/api', 'GET'],
    ['https://www.ktmessenger.com/api/health', 'GET'],
    ['https://www.ktmessenger.com/api/admin/auth/login', 'POST'],
    ['https://www.ktmessenger.com/api/contact', 'POST'],
    ['https://www.ktmessenger.com/api/blog?lang=hi', 'GET'],
    ['https://www.ktmessenger.com/api/contact', 'OPTIONS'],
    ['https://landing-api.ktmessenger.com/api/health', 'GET'],
  ]) {
    const request = new Request(url, {
      method,
      body: method === 'POST' ? '{"test":true}' : undefined,
      headers: { cookie: 'test=local-only', authorization: 'Bearer local-test-only' },
    })
    const upstream = new Response('{"success":true}', {
      status: 200, headers: { 'content-type': 'application/json', 'set-cookie': 'test=local-only' },
    })
    const mock = t.mock.method(globalThis, 'fetch', async (forwarded) => {
      assert.equal(forwarded, request)
      return upstream
    })
    const response = await worker.fetch(request)
    assert.equal(response, upstream)
    assert.equal(response.headers.get('location'), null)
    assert.equal(mock.mock.callCount(), 1)
    mock.mock.restore()
  }
})

test('unrelated hosts and forged forwarded headers cannot trigger a redirect', async (t) => {
  const upstream = new Response('origin')
  t.mock.method(globalThis, 'fetch', async () => upstream)
  for (const host of ['ktmessenger.com', 'localhost:5174', 'www.ktmessenger.com.evil.example', 'admin.ktmessenger.com']) {
    const request = new Request(`https://${host}/`, {
      headers: { 'x-forwarded-host': 'www.ktmessenger.com', forwarded: 'host=www.ktmessenger.com;proto=http' },
    })
    assert.equal(await worker.fetch(request), upstream)
  }
})

test('apex non-HTML blog fallback and crawler responses keep existing processing', async (t) => {
  const origin = new Response('not HTML', { headers: { 'content-type': 'text/plain' } })
  const mock = t.mock.method(globalThis, 'fetch', async () => origin)
  assert.equal(await worker.fetch(new Request('https://ktmessenger.com/blog/example')), origin)
  assert.equal(mock.mock.calls[0].arguments[0].headers.get('x-kt-blog-meta'), '1')
  mock.mock.restore()
  const sitemap = new Response('<sitemapindex/>', { headers: { 'content-type': 'application/xml' } })
  t.mock.method(globalThis, 'fetch', async (url) => {
    assert.equal(url, 'https://landing-api.ktmessenger.com/sitemap.xml')
    return sitemap
  })
  assert.equal(await worker.fetch(new Request('https://ktmessenger.com/sitemap.xml')), sitemap)
})

test('route configuration covers WWW homepage, index and paths for both schemes', async () => {
  const config = await readFile(new URL('../wrangler.toml', import.meta.url), 'utf8')
  assert.match(config, /pattern = "www\.ktmessenger\.com\/\*"/)
  assert.doesNotMatch(config, /pattern = "ktmessenger\.com\/\*"/)
})

test('local HTTP transport returns real 301 headers from the Worker handler', async () => {
  // This bridge tests HTTP serialization, not Cloudflare TLS/routing.
  const server = http.createServer(async (req, res) => {
    try {
      const result = await worker.fetch(new Request(`http://${req.headers.host}${req.url}`))
      res.writeHead(result.status, Object.fromEntries(result.headers))
      res.end(await result.text())
    } catch (error) {
      res.writeHead(500)
      res.end(String(error))
    }
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  try {
    const response = await new Promise((resolve, reject) => {
      http.get({ hostname: '127.0.0.1', port: server.address().port,
        path: '/blog?source=test', headers: { host: 'www.ktmessenger.com' } }, (res) => {
        res.resume()
        res.on('end', () => resolve(res))
      }).on('error', reject)
    })
    assert.equal(response.statusCode, 301)
    assert.equal(response.headers.location, 'https://ktmessenger.com/blog?source=test')
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
})
