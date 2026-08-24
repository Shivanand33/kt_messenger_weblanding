export function DataTable({ columns, rows, rowKey = 'id', actions, actionsHeader = 'Actions' }) {
  return (
    <div className="table-wrap card">
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={c.width ? { width: c.width } : undefined}>{c.header}</th>
            ))}
            {actions ? <th style={{ textAlign: 'right' }}>{actionsHeader}</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]}>
              {columns.map((c) => (
                <td key={c.key}>{c.render ? c.render(row) : row[c.key] ?? '—'}</td>
              ))}
              {actions ? (
                <td>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>{actions(row)}</div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
