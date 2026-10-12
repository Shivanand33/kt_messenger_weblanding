import { useEffect } from 'react'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { useSeo } from '../../hooks/useSeo'
import { useAdminSeo } from '../../hooks/useAdminSeo'
import { Newsroom } from './Newsroom'

/**
 * /news — the newsroom, and nothing else.
 *
 * This was a long marketing page: a hero, a spotlight story, a trending rail,
 * a filterable feed, an audio brief, topics, publishers, fact checks,
 * features, testimonials, a newsletter and an FAQ — all of it illustrated with
 * written sample articles and invented mastheads. It now shows the news, live
 * from the KT news service, and leaves the selling to the pages that are for
 * selling.
 */
export function NewsPage() {
  // Written as plain literals so scripts/route-seo.mjs can read them straight
  // out of this file and put the same title and description into the static
  // HTML the route serves — without a second copy to keep in sync.
  useSeo({
    title: 'KT News | Live World Headlines & Breaking Stories',
    description:
      'Read live headlines from newsrooms around the world on KT News. Every story opens at the publisher that wrote it, inside KT Messenger.',
    path: '/news',
  })
  useAdminSeo('news', '/news')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <MainLayout>
      <Newsroom />
    </MainLayout>
  )
}
