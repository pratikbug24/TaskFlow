import { useEffect, useRef, useState } from 'react';
import { Badge } from './ui.js';
import { dueLabel, dueTone } from '../lib/format.js';

const PRIORITY_TONE = { high: 'rose', medium: 'amber', low: 'sky' };

export default function TodoItem({ todo, onToggle, onEdit, onDelete, busy }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef(null);

  useEffect(() => {
    setTitle(todo.title);
  }, [todo.title]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function commit() {
    const next = title.trim();
    setEditing(false);
    if (next && next !== todo.title) {
      onEdit(todo, { title: next });
    } else {
      setTitle(todo.title);
    }
  }

  const tone = dueTone(todo.dueDate, todo.completed);
  const due = dueLabel(todo.dueDate);

  return (
    <li className={`todo${todo.completed ? ' done' : ''}`}>
      <button
        className="check"
        onClick={() => onToggle(todo)}
        disabled={busy}
        aria-label={todo.completed ? 'Mark as not done' : 'Mark as done'}
      >
        {todo.completed ? '✓' : ''}
      </button>

      <div className="todo-body">
        {editing ? (
          <input
            ref={inputRef}
            className="input inline-edit"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') commit();
              if (event.key === 'Escape') {
                setTitle(todo.title);
                setEditing(false);
              }
            }}
          />
        ) : (
          <button className="todo-title" onClick={() => setEditing(true)} title="Click to rename">
            {todo.title}
          </button>
        )}

        {todo.notes ? <p className="todo-notes">{todo.notes}</p> : null}

        <div className="todo-meta">
          <Badge tone={PRIORITY_TONE[todo.priority]}>{todo.priority}</Badge>
          {due && !todo.completed ? <span className={`due due-${tone}`}>{due}</span> : null}
        </div>
      </div>

      <div className="todo-actions">
        <button className="icon-btn" onClick={() => onEdit(todo, {})} aria-label="Edit details">✎</button>
        <button className="icon-btn danger" onClick={() => onDelete(todo)} aria-label="Delete todo">🗑</button>
      </div>
    </li>
  );
}
