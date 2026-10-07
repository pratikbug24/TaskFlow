import { useNavigate } from 'react-router-dom';
import { Avatar } from './ui.js';
import { useAuth } from '../context/AuthContext.js';
import { useTheme } from '../context/ThemeContext.js';

export default function Topbar({ title, subtitle, onMenu, action }) {
  const { user } = useAuth();
  const { theme, update } = useTheme();
  const navigate = useNavigate();

  function toggleTheme() {
    update({ theme: theme === 'dark' ? 'light' : 'dark' });
  }

  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open navigation">☰</button>
      <div className="topbar-title">
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <div className="topbar-actions">
        {action}
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        <button className="avatar-btn" onClick={() => navigate('/app/profile')} aria-label="Open profile">
          <Avatar name={user?.name} src={user?.avatarUrl} size="sm" />
        </button>
      </div>
    </header>
  );
}
