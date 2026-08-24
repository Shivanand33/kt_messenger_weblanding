// Normalise ?page=&pageSize= query params into safe skip/take + a meta builder.
export function parsePagination(query, { defaultSize = 10, maxSize = 100 } = {}) {
  let page = parseInt(query.page, 10)
  let pageSize = parseInt(query.pageSize, 10)
  if (!Number.isFinite(page) || page < 1) page = 1
  if (!Number.isFinite(pageSize) || pageSize < 1) pageSize = defaultSize
  if (pageSize > maxSize) pageSize = maxSize
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize }
}

export function pageMeta({ page, pageSize, total }) {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}
