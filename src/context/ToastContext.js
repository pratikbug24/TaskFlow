import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function push(tone, message) {
    const id = nextId++;
    setToasts((current) => [...current, { id, tone, message }]);
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3200);
  }

  const value = useMemo(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('error', message),
      info: (message) => push('info', message),
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.tone}`}>{toast.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside a ToastProvider');
  return context;
}

/** Apply a persisted theme choice to <html data-theme>. */
export function useThemeEffect(theme) {
  useEffect(() => {
    const root = document.documentElement;
    if (!theme || theme === 'system') {
      root.removeAttribute('data-theme');
      return;
    }
    root.setAttribute('data-theme', theme);
  }, [theme]);
}
