import { useState } from 'react';
import { Modal } from './ui.js';

const PRIORITIES = ['low', 'medium', 'high'];

/** Add-todo composer used at the top of every list page. */
export function TodoComposer({ onAdd, placeholder = 'Add a task and press Enter…' }) {
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const value = title.trim();
    if (!value || busy) return;
    setBusy(true);
    try {
      await onAdd({ title: value });
      setTitle('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="composer" onSubmit={submit}>
      <span className="composer-plus">＋</span>
      <input
        className="composer-input"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder={placeholder}
        aria-label="New todo title"
      />
      <button className="btn btn-primary" type="submit" disabled={busy || !title.trim()}>
        Add
      </button>
    </form>
  );
}

/** Modal for creating or editing a todo with full detail. */
export function TodoDialog({ open, todo, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    title: todo?.title || '',
    notes: todo?.notes || '',
    priority: todo?.priority || 'medium',
    dueDate: todo?.dueDate || '',
  }));
  const [busy, setBusy] = useState(false);

  const isEdit = Boolean(todo?.id);

  function update(key) {
    return (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.title.trim() || busy) return;
    setBusy(true);
    try {
      await onSave({ ...form, title: form.title.trim(), dueDate: form.dueDate || null });
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      title={isEdit ? 'Edit task' : 'New task'}
      onClose={onClose}
      footer={
        <>
          <button className="btn" type="button" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" type="submit" form="todo-form" disabled={busy}>
            {isEdit ? 'Save changes' : 'Add task'}
          </button>
        </>
      }
    >
      <form id="todo-form" className="stack" onSubmit={submit}>
        <div className="field">
          <label>Title</label>
          <input className="input" value={form.title} onChange={update('title')} required autoFocus />
        </div>
        <div className="field">
          <label>Notes</label>
          <textarea className="textarea" value={form.notes} onChange={update('notes')} placeholder="Optional details…" />
        </div>
        <div className="form-row">
          <div className="field grow">
            <label>Priority</label>
            <select className="select" value={form.priority} onChange={update('priority')}>
              {PRIORITIES.map((value) => (
                <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="field grow">
            <label>Due date</label>
            <input className="input" type="date" value={form.dueDate} onChange={update('dueDate')} />
          </div>
        </div>
      </form>
    </Modal>
  );
}
