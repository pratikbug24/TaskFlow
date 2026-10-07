import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Topbar from '../components/Topbar.js';
import { Switch } from '../components/ui.js';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.js';
import { useTheme } from '../context/ThemeContext.js';
import { useToast } from '../context/ToastContext.js';

const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const TOGGLES = [
  { key: 'dailyReminder', title: 'Daily reminder', hint: 'A nudge to review your list each morning.' },
  { key: 'weeklySummary', title: 'Weekly summary', hint: 'A Sunday recap of what you finished.' },
  { key: 'soundEffects', title: 'Sound effects', hint: 'A soft click when you complete a task.' },
];

export default function Settings() {
  const { openNav } = useOutletContext();
  const toast = useToast();
  const { settings, setSettings } = useAuth();
  const { theme, accent, accents, update } = useTheme();
  const [reminderTime, setReminderTime] = useState('09:00');

  useEffect(() => {
    if (settings?.reminderTime) setReminderTime(settings.reminderTime);
  }, [settings]);

  async function persist(patch) {
    try {
      const saved = await api('/settings', { method: 'PATCH', body: patch });
      setSettings(saved);
      toast.success('Settings saved');
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (!settings) {
    return (
      <div className="page">
        <Topbar title="Settings" subtitle="Preferences and appearance" onMenu={openNav} />
        <div className="card empty small faint">Loading settings…</div>
      </div>
    );
  }

  return (
    <div className="page">
      <Topbar title="Settings" subtitle="Preferences and appearance" onMenu={openNav} />

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Appearance</div>
              <div className="card-subtitle">Theme and accent colour</div>
            </div>
          </div>

          <div className="field">
            <label>Theme</label>
            <div className="segmented">
              {THEMES.map((option) => (
                <button
                  key={option.value}
                  className={theme === option.value ? 'active' : ''}
                  onClick={() => update({ theme: option.value })}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field" style={{ marginTop: 18 }}>
            <label>Accent colour</label>
            <div className="row" style={{ flexWrap: 'wrap', gap: 10 }}>
              {accents.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  title={option.name}
                  onClick={() => update({ accentColor: option.value })}
                  className={`swatch${accent === option.value ? ' selected' : ''}`}
                  style={{ background: option.value }}
                  aria-label={option.name}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Reminders</div>
              <div className="card-subtitle">Choose how TaskFlow nudges you</div>
            </div>
          </div>

          {TOGGLES.map((item) => (
            <div className="toggle-row" key={item.key}>
              <div className="toggle-text">
                <strong>{item.title}</strong>
                <span>{item.hint}</span>
              </div>
              <Switch
                checked={Boolean(settings[item.key])}
                label={item.title}
                onChange={(value) => persist({ [item.key]: value })}
              />
            </div>
          ))}

          <div className="field" style={{ marginTop: 18 }}>
            <label>Reminder time</label>
            <input
              className="input"
              type="time"
              value={reminderTime}
              disabled={!settings.dailyReminder}
              onChange={(event) => setReminderTime(event.target.value)}
              onBlur={() => persist({ reminderTime })}
            />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Account</div>
            <div className="card-subtitle">Plan and data</div>
          </div>
        </div>
        <div className="toggle-row">
          <div className="toggle-text">
            <strong>Current plan</strong>
            <span>{settings ? 'Upgrade for unlimited lists and history.' : ''}</span>
          </div>
          <button className="btn btn-primary" onClick={() => toast.info('Upgrade flow is not part of this demo')}>
            Upgrade
          </button>
        </div>
        <div className="toggle-row">
          <div className="toggle-text">
            <strong>Delete all tasks</strong>
            <span>Removes every todo in your account. This cannot be undone.</span>
          </div>
          <button className="btn btn-danger" onClick={() => toast.error('Disabled in this demo')}>
            Delete data
          </button>
        </div>
      </div>
    </div>
  );
}
