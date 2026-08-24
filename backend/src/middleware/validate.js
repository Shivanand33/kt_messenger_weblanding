// Validate req.body / req.query / req.params against a Zod schema and replace
// the request property with the parsed (typed, defaulted) value.
export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source])
    if (!result.success) return next(result.error)
    req[source] = result.data
    next()
  }
}
