import { NavLink } from 'react-router-dom';
import { Avatar } from './ui.js';
import { useAuth } from '../context/AuthContext.js';

const NAV = [
  { to: '/app', label: 'Today', icon: '◎', end: true },
  { to: '/app/todos', label: 'All todos', icon: '☑' },
  { to: '/app/completed', label: 'Completed', icon: '✓' },
  { to: '/app/profile', label: 'Profile', icon: '◐' },
  { to: '/app/settings', label: 'Settings', icon: '⚙' },
  { to: '/app/database', label: 'Database', icon: '⛁' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      {open ? <div className="scrim" onClick={onClose} /> : null}
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="brand">
          <span className="brand-mark">TF</span>
          <div>
            <strong>TaskFlow</strong>
            <span className="brand-sub">Personal todos</span>
          </div>
        </div>

        <nav className="nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="user-chip">
            <Avatar name={user?.name} src={user?.avatarUrl} size="sm" />
            <div className="user-chip-text">
              <strong>{user?.name}</strong>
              <span className="faint">{user?.email}</span>
            </div>
          </div>
          <button className="btn btn-ghost btn-block" onClick={logout}>Sign out</button>
        </div>
      </aside>
    </>
  );
}
