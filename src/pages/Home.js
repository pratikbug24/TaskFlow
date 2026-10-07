import { Link } from 'react-router-dom';
import { MarketingFooter, MarketingHeader } from '../components/MarketingLayout.js';

const FEATURES = [
  {
    icon: '◎',
    title: 'Today view',
    body: 'Your day at a glance. Tasks are grouped into Overdue, Today and Later so the next thing to do is always obvious.',
  },
  {
    icon: '☑',
    title: 'Full todo control',
    body: 'Create, rename inline, edit notes, set a priority and add a due date. Tick a task off and it moves to Completed.',
  },
  {
    icon: '⚲',
    title: 'Filter and search',
    body: 'Slice your list by status or priority, or search across titles to find any task instantly.',
  },
  {
    icon: '◐',
    title: 'Profile and settings',
    body: 'Keep your name, job title, company, avatar and bio up to date, and tune reminders to suit your routine.',
  },
  {
    icon: '☾',
    title: 'Themes and accents',
    body: 'Light, dark or system theme with six accent colours. Your choice follows you to the database, not just the browser.',
  },
  {
    icon: '⛁',
    title: 'Live database explorer',
    body: 'Inspect every table, column, index and row straight from the UI. Nothing about this app is hidden behind a mock.',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Create your account',
    body: 'Register in seconds or use the pre-filled demo account to look around straight away.',
  },
  {
    step: '02',
    title: 'Capture everything',
    body: 'Use the quick composer for one-liners, or open the dialog to add notes, a priority and a due date.',
  },
  {
    step: '03',
    title: 'Work the list',
    body: 'The Today view surfaces what is overdue and what is due now, so you always know where to start.',
  },
  {
    step: '04',
    title: 'Review and clear',
    body: 'Check your completion stats, revisit finished work, and clear completed tasks to keep the list clean.',
  },
];

const STACK = [
  {
    name: 'React + Vite',
    role: 'Client',
    body: 'A single-page app with a sidebar shell, route guards and context providers for auth, theme and toasts.',
    points: ['React 18', 'React Router', 'Vite build', 'Context API'],
  },
  {
    name: 'Express',
    role: 'Gateway',
    body: 'Owns JWT authentication, request validation and the REST surface. The client only ever talks to this layer.',
    points: ['JWT auth', 'REST routes', 'Validation', 'Proxied /api'],
  },
  {
    name: 'PHP',
    role: 'Data layer',
    body: 'A PDO-powered JSON action router. This is the only component that talks to the database.',
    points: ['PDO prepared statements', 'Action router', 'Password hashing', 'JSON responses'],
  },
  {
    name: 'MySQL / MariaDB',
    role: 'Database',
    body: 'InnoDB tables with foreign keys and indexes, holding accounts, tasks and user preferences.',
    points: ['users', 'todos', 'user_settings', 'Foreign keys'],
  },
];

const API_GROUPS = [
  { method: 'POST', path: '/api/auth/register', note: 'Create an account' },
  { method: 'POST', path: '/api/auth/login', note: 'Sign in, returns a JWT' },
  { method: 'GET', path: '/api/auth/me', note: 'Current user and settings' },
  { method: 'GET', path: '/api/todos', note: 'List with filter, priority, search' },
  { method: 'POST', path: '/api/todos', note: 'Create a todo' },
  { method: 'PATCH', path: '/api/todos/:id', note: 'Update or complete' },
  { method: 'DELETE', path: '/api/todos/:id', note: 'Delete a todo' },
  { method: 'GET', path: '/api/profile/stats', note: 'Aggregated task counts' },
  { method: 'GET', path: '/api/database/tables', note: 'Schema and row counts' },
];

const SCHEMA = [
  { table: 'users', columns: 'id, name, email, password_hash, avatar_url, job_title, company, bio, plan, created_at' },
  { table: 'todos', columns: 'id, user_id, title, notes, priority, due_date, completed, completed_at, created_at' },
  { table: 'user_settings', columns: 'user_id, theme, accent_color, daily_reminder, reminder_time, weekly_summary' },
];

const FAQ = [
  {
    q: 'Is this a real full-stack application?',
    a: 'Yes. The React client talks to an Express gateway, which calls a PHP data layer that reads and writes MySQL. There are no mocked endpoints — open the Database page to see the rows you just created.',
  },
  {
    q: 'Why PHP in the middle?',
    a: 'It demonstrates a gateway-plus-service architecture: the gateway handles auth and validation, while PHP owns all SQL through PDO prepared statements. Either layer can be swapped without touching the client.',
  },
  {
    q: 'Does it support teams or shared projects?',
    a: 'No, and that is deliberate. TaskFlow is a simple personal todo list — one account, one private list. The earlier project and team concepts were removed in favour of staying focused.',
  },
  {
    q: 'How is my data stored?',
    a: 'Everything lives in three InnoDB tables. Todos are linked to your account with a cascading foreign key, so deleting an account removes its tasks and settings.',
  },
  {
    q: 'Can I try it without signing up?',
    a: 'Yes. The sign-in form is pre-filled with a demo account — just press Sign in to explore a list that already has tasks in it.',
  },
];

export default function Home() {
  return (
    <div className="mkt" id="top">
      <MarketingHeader />

      <main>
        {/* ---------------------------------------------------------- hero -- */}
        <section className="mkt-hero">
          <div className="mkt-container mkt-hero-inner">
            <div className="mkt-hero-copy">
              <span className="pill">Personal todo list · React + Express + PHP + MySQL</span>
              <h1>
                The todo list that
                <span className="grad"> stays out of your way</span>
              </h1>
              <p className="mkt-lead">
                TaskFlow is a small, focused SaaS product for keeping track of what
                you need to do. Capture a task, give it a priority and a due date,
                then work through a Today view that tells you exactly what is
                overdue and what is next.
              </p>

              <div className="mkt-hero-actions">
                <Link className="btn btn-primary btn-lg" to="/register">Get started free</Link>
                <Link className="btn btn-lg" to="/login">Try the demo</Link>
              </div>

              <ul className="mkt-hero-points">
                <li>No credit card, no setup</li>
                <li>Light and dark themes</li>
                <li>Live database explorer</li>
              </ul>
            </div>

            <div className="mkt-hero-preview" aria-hidden="true">
              <div className="preview-card">
                <div className="preview-head">
                  <span className="preview-dot" />
                  <span className="preview-dot" />
                  <span className="preview-dot" />
                  <span className="preview-title">Today</span>
                </div>
                <div className="preview-stats">
                  <div><strong>13</strong><span>Open</span></div>
                  <div><strong>2</strong><span>Due today</span></div>
                  <div><strong>2</strong><span>Overdue</span></div>
                </div>
                <ul className="preview-list">
                  <li><span className="preview-check" />Finish the quarterly report <em>high</em></li>
                  <li><span className="preview-check" />Reply to Sam about the venue <em>med</em></li>
                  <li className="done"><span className="preview-check on">✓</span>Water the plants</li>
                  <li><span className="preview-check" />Book dentist appointment <em>low</em></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ features -- */}
        <section className="mkt-section" id="features">
          <div className="mkt-container">
            <div className="mkt-section-head">
              <span className="eyebrow">Features</span>
              <h2>Everything a personal list needs</h2>
              <p>Nothing you have to configure, nothing you have to learn.</p>
            </div>

            <div className="mkt-grid mkt-grid-3">
              {FEATURES.map((feature) => (
                <article className="mkt-card" key={feature.title}>
                  <span className="mkt-card-icon">{feature.icon}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- how -- */}
        <section className="mkt-section mkt-alt" id="how">
          <div className="mkt-container">
            <div className="mkt-section-head">
              <span className="eyebrow">How it works</span>
              <h2>From empty list to done</h2>
              <p>Four small steps, no ceremony.</p>
            </div>

            <div className="mkt-grid mkt-grid-4">
              {STEPS.map((item) => (
                <article className="mkt-step" key={item.step}>
                  <span className="mkt-step-num">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- stack -- */}
        <section className="mkt-section" id="stack">
          <div className="mkt-container">
            <div className="mkt-section-head">
              <span className="eyebrow">Tech stack</span>
              <h2>Four layers, one request path</h2>
              <p>
                The browser talks to the gateway. The gateway talks to PHP. PHP
                owns the database. Each layer has one job.
              </p>
            </div>

            <div className="mkt-flow">
              <span className="mkt-flow-node">React SPA</span>
              <span className="mkt-flow-arrow">→</span>
              <span className="mkt-flow-node">Express gateway</span>
              <span className="mkt-flow-arrow">→</span>
              <span className="mkt-flow-node">PHP data layer</span>
              <span className="mkt-flow-arrow">→</span>
              <span className="mkt-flow-node">MySQL</span>
            </div>

            <div className="mkt-grid mkt-grid-4">
              {STACK.map((layer) => (
                <article className="mkt-card" key={layer.name}>
                  <span className="mkt-tag">{layer.role}</span>
                  <h3>{layer.name}</h3>
                  <p>{layer.body}</p>
                  <ul className="mkt-chips">
                    {layer.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ data/api -- */}
        <section className="mkt-section mkt-alt">
          <div className="mkt-container mkt-two-col">
            <div>
              <span className="eyebrow">Data model</span>
              <h2>Three tables, clearly related</h2>
              <p className="mkt-section-lead">
                Todos and settings both belong to a user. Deleting an account
                cascades to remove everything it owns.
              </p>

              <div className="mkt-schema">
                {SCHEMA.map((table) => (
                  <div className="mkt-schema-row" key={table.table}>
                    <strong>{table.table}</strong>
                    <span className="mono">{table.columns}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="eyebrow">API surface</span>
              <h2>Clean REST endpoints</h2>
              <p className="mkt-section-lead">
                Everything the client can do is a documented call to the gateway.
              </p>

              <ul className="mkt-api">
                {API_GROUPS.map((endpoint) => (
                  <li key={`${endpoint.method}-${endpoint.path}`}>
                    <span className={`mkt-method mkt-method-${endpoint.method.toLowerCase()}`}>
                      {endpoint.method}
                    </span>
                    <span className="mono">{endpoint.path}</span>
                    <span className="faint">{endpoint.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- faq -- */}
        <section className="mkt-section" id="faq">
          <div className="mkt-container mkt-narrow">
            <div className="mkt-section-head">
              <span className="eyebrow">FAQ</span>
              <h2>Questions about the project</h2>
            </div>

            <div className="mkt-faq">
              {FAQ.map((item) => (
                <details key={item.q} className="mkt-faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- cta -- */}
        <section className="mkt-cta">
          <div className="mkt-container mkt-cta-inner">
            <h2>Start your list today</h2>
            <p>Free to use, and the demo account is already waiting.</p>
            <div className="mkt-hero-actions">
              <Link className="btn btn-primary btn-lg" to="/register">Create an account</Link>
              <Link className="btn btn-lg" to="/login">Sign in</Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
