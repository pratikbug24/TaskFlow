import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Topbar from '../components/Topbar.js';
import { Avatar, Badge, Stat } from '../components/ui.js';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { useStats } from '../lib/useTodos.js';
import { formatDate } from '../lib/format.js';

const BLANK = { name: '', jobTitle: '', company: '', bio: '', avatarUrl: '' };

export default function Profile() {
  const { openNav } = useOutletContext();
  const { user, refreshProfile } = useAuth();
  const toast = useToast();
  const { stats } = useStats();

  const [form, setForm] = useState(BLANK);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      jobTitle: user.jobTitle || '',
      company: user.company || '',
      bio: user.bio || '',
      avatarUrl: user.avatarUrl || '',
    });
  }, [user]);

  function update(key) {
    return (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await api('/profile', { method: 'PATCH', body: form });
      await refreshProfile();
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <Topbar title="Profile" subtitle="Your personal account" onMenu={openNav} />

      <div className="grid split">
        <form className="card" onSubmit={save}>
          <div className="card-header">
            <div>
              <div className="card-title">Account details</div>
              <div className="card-subtitle">This information is private to you</div>
            </div>
          </div>

          <div className="stack">
            <div className="field">
              <label>Full name</label>
              <input className="input" value={form.name} onChange={update('name')} required />
            </div>
            <div className="form-row">
              <div className="field grow">
                <label>Job title</label>
                <input className="input" value={form.jobTitle} onChange={update('jobTitle')} placeholder="Product Designer" />
              </div>
              <div className="field grow">
                <label>Company</label>
                <input className="input" value={form.company} onChange={update('company')} placeholder="Northwind Labs" />
              </div>
            </div>
            <div className="field">
              <label>Avatar URL</label>
              <input className="input" value={form.avatarUrl} onChange={update('avatarUrl')} placeholder="https://…" />
            </div>
            <div className="field">
              <label>Bio</label>
              <textarea className="textarea" value={form.bio} onChange={update('bio')} placeholder="A short introduction…" />
            </div>
            <div className="row">
              <button className="btn btn-primary" type="submit" disabled={busy}>
                {busy ? 'Saving…' : 'Save changes'}
              </button>
              <button
                className="btn"
                type="button"
                onClick={() =>
                  setForm({
                    name: user?.name || '',
                    jobTitle: user?.jobTitle || '',
                    company: user?.company || '',
                    bio: user?.bio || '',
                    avatarUrl: user?.avatarUrl || '',
                  })
                }
              >
                Reset
              </button>
            </div>
          </div>
        </form>

        <div className="stack">
          <div className="card center">
            <Avatar name={user?.name} src={user?.avatarUrl} size="lg" />
            <div className="profile-name">{user?.name}</div>
            <div className="small faint">{user?.email}</div>
            <div className="row center-row">
              <Badge tone="accent">{user?.plan} plan</Badge>
            </div>
            <div className="small faint" style={{ marginTop: 12 }}>
              Member since {formatDate(user?.createdAt)}
            </div>
          </div>

          <div className="grid grid-2">
            <Stat label="Total" value={stats?.total ?? '—'} />
            <Stat label="Completed" value={stats?.completed ?? '—'} />
            <Stat label="Open" value={stats?.active ?? '—'} />
            <Stat label="Rate" value={stats ? `${stats.completionRate}%` : '—'} />
          </div>
        </div>
      </div>
    </div>
  );
}
