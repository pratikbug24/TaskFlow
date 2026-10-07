import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.js';
import Shell from './components/Shell.js';
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Today from './pages/Today.js';
import Todos from './pages/Todos.js';
import Completed from './pages/Completed.js';
import Profile from './pages/Profile.js';
import Settings from './pages/Settings.js';
import Database from './pages/Database.js';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="boot">Loading your list…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="boot">Loading…</div>;
  if (user) return <Navigate to="/app" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

      <Route
        path="/app"
        element={
          <Protected>
            <Shell />
          </Protected>
        }
      >
        <Route index element={<Today />} />
        <Route path="todos" element={<Todos />} />
        <Route path="completed" element={<Completed />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="database" element={<Database />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}