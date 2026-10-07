import { useState } from 'react';
import TodoItem from './TodoItem.js';
import { TodoDialog } from './TodoForm.js';
import { EmptyState, Loading } from './ui.js';

/**
 * Renders a list of todos and owns the edit dialog so every page gets the
 * same rename / edit-details behaviour without duplicating it.
 */
export default function TodoList({ todos, loading, busyId, onToggle, onEdit, onDelete, emptyTitle, emptyHint }) {
  const [editing, setEditing] = useState(null);

  if (loading) return <Loading label="Loading your tasks…" />;
  if (todos.length === 0) return <EmptyState title={emptyTitle || 'Nothing here yet'} hint={emptyHint} />;

  return (
    <>
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            busy={busyId === todo.id}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={(item, patch) => (patch && Object.keys(patch).length ? onEdit(item, patch) : setEditing(item))}
          />
        ))}
      </ul>

      <TodoDialog
        open={Boolean(editing)}
        todo={editing}
        onClose={() => setEditing(null)}
        onSave={(payload) => onEdit(editing, payload)}
      />
    </>
  );
}
