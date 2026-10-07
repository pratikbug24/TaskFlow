import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Topbar from '../components/Topbar.js';
import TodoList from '../components/TodoList.js';
import { TodoComposer, TodoDialog } from '../components/TodoForm.js';
import { Stat } from '../components/ui.js';
import { useAuth } from '../context/AuthContext.js';
import { useTodos, useStats } from '../lib/useTodos.js';
import { greeting } from '../lib/format.js';

export default function Today() {
  const { openNav } = useOutletContext();
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  // The list endpoint returns active + completed; split them for the view.
  const { todos, loading, busyId, add, edit, toggle, remove } = useTodos({ filter: 'active' });
  const { stats, reloadStats } = useStats();

  const today = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  }, []);

  const { dueToday, overdue, upcoming } = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const buckets = { dueToday: [], overdue: [], upcoming: [] };
    todos.forEach((todo) => {
      if (!todo.dueDate) return buckets.upcoming.push(todo);
      const date = new Date(String(todo.dueDate).replace(' ', 'T'));
      const diff = Math.round((date - startOfToday) / 86400000);
      if (diff < 0) buckets.overdue.push(todo);
      else if (diff === 0) buckets.dueToday.push(todo);
      else buckets.upcoming.push(todo);
    });
    return buckets;
  }, [todos]);

  async function handleAdd(payload) {
    await add(payload);
    reloadStats();
  }

  async function handleToggle(todo) {
    await toggle(todo);
    reloadStats();
  }

  async function handleDelete(todo) {
    await remove(todo);
    reloadStats();
  }

  return (
    <div className="page">
      <Topbar
        title={greeting(user?.name)}
        subtitle={today}
        onMenu={openNav}
        action={<button className="btn btn-primary" onClick={() => setDialogOpen(true)}>＋ New task</button>}
      />

      <div className="grid grid-4">
        <Stat label="Open" value={stats?.active ?? '—'} hint="still to do" />
        <Stat label="Due today" value={stats?.dueToday ?? '—'} tone={stats?.dueToday ? 'warn' : undefined} />
        <Stat label="Overdue" value={stats?.overdue ?? '—'} tone={stats?.overdue ? 'danger' : undefined} />
        <Stat label="Completed" value={stats?.completed ?? '—'} hint={stats ? `${stats.completionRate}% of all tasks` : ''} />
      </div>

      <TodoComposer onAdd={handleAdd} placeholder="What needs doing today?" />

      {overdue.length > 0 ? (
        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title text-danger">Overdue</div>
              <div className="card-subtitle">{overdue.length} task{overdue.length === 1 ? '' : 's'} past due</div>
            </div>
          </div>
          <TodoList
            todos={overdue}
            loading={loading}
            busyId={busyId}
            onToggle={handleToggle}
            onEdit={edit}
            onDelete={handleDelete}
          />
        </section>
      ) : null}

      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Today</div>
            <div className="card-subtitle">{dueToday.length} due today</div>
          </div>
        </div>
        <TodoList
          todos={dueToday}
          loading={loading}
          busyId={busyId}
          onToggle={handleToggle}
          onEdit={edit}
          onDelete={handleDelete}
          emptyTitle="Nothing due today"
          emptyHint="Enjoy the breathing room, or add something new."
        />
      </section>

      {upcoming.length > 0 ? (
        <section className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Later</div>
              <div className="card-subtitle">{upcoming.length} task{upcoming.length === 1 ? '' : 's'} with no date or a future date</div>
            </div>
          </div>
          <TodoList
            todos={upcoming}
            loading={loading}
            busyId={busyId}
            onToggle={handleToggle}
            onEdit={edit}
            onDelete={handleDelete}
          />
        </section>
      ) : null}

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
