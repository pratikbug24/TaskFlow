/** Formatting helpers shared across pages. */

export function formatDate(value) {
    if (!value) return null;
    const date = new Date(String(value).replace(' ', 'T'));
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }
  
  /** Turn a due date into a human label such as "Today" or "3 days ago". */
  export function dueLabel(value) {
    if (!value) return null;
    const date = new Date(String(value).replace(' ', 'T'));
    if (Number.isNaN(date.getTime())) return null;
  
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diff = Math.round((startOfDay(date) - startOfDay(new Date())) / 86400000);
  
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff === -1) return 'Yesterday';
    if (diff < 0) return `${Math.abs(diff)} days ago`;
    if (diff < 7) return `In ${diff} days`;
    return formatDate(value);
  }
  
  /** Classify a due date for colour-coding. */
  export function dueTone(value, completed) {
    if (completed || !value) return 'neutral';
    const date = new Date(String(value).replace(' ', 'T'));
    if (Number.isNaN(date.getTime())) return 'neutral';
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diff = Math.round((startOfDay(date) - startOfDay(new Date())) / 86400000);
    if (diff < 0) return 'danger';
    if (diff === 0) return 'warn';
    return 'neutral';
  }
  
  export function greeting(name) {
    const hour = new Date().getHours();
    const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return name ? `${part}, ${name.split(' ')[0]}` : part;
  }
  