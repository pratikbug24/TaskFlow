export function Avatar({ name = '', src, size = 'md' }) {
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  
    if (src) {
      return <img className={`avatar avatar-${size}`} src={src} alt={name} />;
    }
    return <span className={`avatar avatar-${size}`}>{initials || '?'}</span>;
  }
  
  export function Badge({ tone = 'slate', children }) {
    return <span className={`badge badge-${tone}`}>{children}</span>;
  }
  
  export function Stat({ label, value, tone, hint }) {
    return (
      <div className="stat">
        <span className="stat-label">{label}</span>
        <span className={`stat-value${tone ? ` text-${tone}` : ''}`}>{value}</span>
        {hint ? <span className="stat-hint">{hint}</span> : null}
      </div>
    );
  }
  
  export function Switch({ checked, onChange, label }) {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`switch${checked ? ' on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="switch-knob" />
      </button>
    );
  }
  
  export function Modal({ open, title, onClose, children, footer }) {
    if (!open) return null;
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
          <div className="modal-head">
            <h3>{title}</h3>
            <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
          </div>
          <div className="modal-body">{children}</div>
          {footer ? <div className="modal-foot">{footer}</div> : null}
        </div>
      </div>
    );
  }
  
  export function EmptyState({ icon = '✓', title, hint }) {
    return (
      <div className="empty">
        <div className="empty-icon">{icon}</div>
        <strong>{title}</strong>
        {hint ? <span className="small faint">{hint}</span> : null}
      </div>
    );
  }
  
  export function Loading({ label = 'Loading…' }) {
    return <div className="empty small faint">{label}</div>;
  }
  