import { useOutletContext } from 'react-router-dom';
import Topbar from '../components/Topbar.js';
import TodoList from '../components/TodoList.js';
import { useTodos, useStats } from '../lib/useTodos.js';

export default function Completed() {
  const { openNav } = useOutletContext();
  const { todos, loading, busyId, edit, toggle, remove, clearCompleted } = useTodos({ filter: 'completed' });
  const { reloadStats } = useStats();

  const wrap = (fn) => async (todo) => {
    await fn(todo);
    reloadStats();
  };

  return (
    <div className="page">
      <Topbar
        title="Completed"
        subtitle={`${todos.length} ${todos.length === 1 ? 'task' : 'tasks'} done`}
        onMenu={openNav}
        action={
          todos.length > 0 ? (
            <button className="btn" onClick={clearCompleted}>Clear completed</button>
          ) : null
        }
      />

      <section className="card">
        <TodoList
          todos={todos}
          loading={loading}
          busyId={busyId}
          onToggle={wrap(toggle)}
          onEdit={wrap(edit)}
          onDelete={wrap(remove)}
          emptyTitle="Nothing completed yet"
          emptyHint="Tick a task off and it will show up here."
        />
      </section>
    </div>
  );
}
