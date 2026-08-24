export function Field({ label, hint, children }) {
  return (
    <div className="field">
      {label ? <label>{label}</label> : null}
      {children}
      {hint ? <div className="hint">{hint}</div> : null}
    </div>
  )
}

export function Input({ label, hint, ...props }) {
  return (
    <Field label={label} hint={hint}>
      <input className="input" {...props} />
    </Field>
  )
}

export function Textarea({ label, hint, ...props }) {
  return (
    <Field label={label} hint={hint}>
      <textarea className="textarea" {...props} />
    </Field>
  )
}

export function Select({ label, hint, options = [], ...props }) {
  return (
    <Field label={label} hint={hint}>
      <select className="select" {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  )
}

export function Checkbox({ label, checked, onChange, ...props }) {
  return (
    <label className="checkbox" style={{ marginBottom: 16 }}>
      <input type="checkbox" checked={!!checked} onChange={onChange} {...props} />
      <span>{label}</span>
    </label>
  )
}
