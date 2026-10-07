import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Topbar from '../components/Topbar.js';
import TodoList from '../components/TodoList.js';
import { TodoComposer, TodoDialog } from '../components/TodoForm.js';
import { useTodos, useStats } from '../lib/useTodos.js';

const FILTERS = [
  { value: 'active', label: 'Open' },
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Due today' },
  { value: 'overdue', label: 'Overdue' },
];

const PRIORITIES = ['low', 'medium', 'high'];

export default function Todos() {
  const { openNav } = useOutletContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState('active');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');

  const { todos, loading, busyId, add, edit, toggle, remove, clearCompleted } = useTodos({
    filter,
    priority,
    search,
  });
  const { reloadStats } = useStats();

  const wrap = (fn) => async (todo) => {
    await fn(todo);
    reloadStats();
  };

  return (
    <div className="page">
      <Topbar
        title="All todos"
        subtitle={`${todos.length} ${todos.length === 1 ? 'task' : 'tasks'} shown`}
        onMenu={openNav}
        action={<button className="btn btn-primary" onClick={() => setDialogOpen(true)}>＋ New task</button>}
      />

      <div className="toolbar">
        <div className="segmented">
          {FILTERS.map((option) => (
            <button
              key={option.value}
              className={filter === option.value ? 'active' : ''}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <input
          className="input search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tasks…"
          aria-label="Search tasks"
        />

        <select className="select" value={priority} onChange={(event) => setPriority(event.target.value)} aria-label="Filter by priority">
          <option value="">All priorities</option>
          {PRIORITIES.map((value) => (
            <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>
          ))}
        </select>

        <button className="btn" onClick={clearCompleted}>Clear completed</button>
      </div>

      <TodoComposer
        onAdd={async (payload) => {
          await add(payload);
          reloadStats();
        }}
        placeholder="Add a task…"
      />

      <section className="card">
        <TodoList
          todos={todos}
          loading={loading}
          busyId={busyId}
          onToggle={wrap(toggle)}
          onEdit={wrap(edit)}
          onDelete={wrap(remove)}
          emptyTitle="No tasks match"
          emptyHint="Try a different filter or add something new."
        />
      </section>

      <TodoDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={async (payload) => {
          await add(payload);
          reloadStats();
        }}
      />
    </div>
  );
}
