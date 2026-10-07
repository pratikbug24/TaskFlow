import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.js';

export default function Shell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <main className="main">
        <Outlet context={{ openNav: () => setOpen(true) }} />
      </main>
    </div>
  );
}
