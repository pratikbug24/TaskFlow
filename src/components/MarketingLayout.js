import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

const NAV = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#stack', label: 'Tech stack' },
  { href: '#faq', label: 'FAQ' },
];

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '#features', label: 'Features' },
      { href: '#how', label: 'How it works' },
      { href: '#stack', label: 'Tech stack' },
      { href: '#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Application',
    links: [
      { to: '/login', label: 'Sign in' },
      { to: '/register', label: 'Create account' },
      { to: '/app', label: 'Today' },
      { to: '/database', label: 'Database explorer' },
    ],
  },
  {
    title: 'Built with',
    links: [
      { href: '#stack', label: 'React + Vite' },
      { href: '#stack', label: 'Express gateway' },
      { href: '#stack', label: 'PHP data layer' },
      { href: '#stack', label: 'MySQL / MariaDB' },
    ],
  },
];

export function MarketingHeader() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="mkt-header">
      <div className="mkt-container mkt-header-inner">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          <span className="brand-mark">TF</span>
          <div>
            <strong>TaskFlow</strong>
            <span className="brand-sub">Personal todos</span>
          </div>
        </a>

        <nav className={`mkt-nav${open ? ' open' : ''}`}>
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mkt-header-actions">
          {user ? (
            <Link className="btn btn-primary" to="/app">Open app</Link>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">Sign in</Link>
              <Link className="btn btn-primary" to="/register">Get started</Link>
            </>
          )}
          <button
            className="icon-btn mkt-menu-btn"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="mkt-footer">
      <div className="mkt-container">
        <div className="mkt-footer-grid">
          <div className="mkt-footer-brand">
            <div className="brand">
              <span className="brand-mark">TF</span>
              <div>
                <strong>TaskFlow</strong>
                <span className="brand-sub">Personal todos</span>
              </div>
            </div>
            <p>
              A small, focused todo list. One list, one person, no project
              management overhead — backed by a real four-layer stack.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div className="mkt-footer-col" key={column.title}>
              <h4>{column.title}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? <Link to={link.to}>{link.label}</Link> : <a href={link.href}>{link.label}</a>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mkt-footer-bottom">
          <span>© {new Date().getFullYear()} TaskFlow. A demo SaaS product.</span>
          <span className="faint">React · Express · PHP · MySQL</span>
        </div>
      </div>
    </footer>
  );
}
