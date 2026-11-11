# TaskFlow — Smart Personal Todo List

> The todo list that stays out of your way.

TaskFlow is a focused, single-page todo application for one person and one list.
Capture a task, give it a priority and a due date, then work through a **Today**
view that tells you exactly what is overdue and what is next. It ships with a
marketing landing page, a full authenticated app shell, light/dark theming, and
a live database explorer that shows the real rows behind the UI.

The client is a **React 19** single-page app. It talks to an `/api` backend
(Express gateway → PHP data layer → MySQL/MariaDB). See
[Backend & the `/api` contract](#backend--the-api-contract) for what you need
running to use the app end to end.

---

## Table of contents

- [App idea](#app-idea)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & installation](#setup--installation)
- [Running the app](#running-the-app)
- [Backend & the `/api` contract](#backend--the-api-contract)
- [API reference](#api-reference)
- [Data model](#data-model)
- [Usage guide](#usage-guide)
- [Available scripts](#available-scripts)
- [Configuration](#configuration)
- [Testing](#testing)
- [Problems & solutions (troubleshooting)](#problems--solutions-troubleshooting)
- [Roadmap / ideas](#roadmap--ideas)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)

---

## App idea

Most task managers are built for teams and then squeezed into personal use.
TaskFlow does the opposite: it is deliberately a **personal** list — one account,
one private list, no shared projects, no ceremony.

The core idea is a **Today-first** workflow:

1. **Capture** everything quickly with a one-line composer.
2. **Triage** with priority and due dates only when they matter.
3. **Work** from a Today view that automatically groups tasks into
   **Overdue**, **Today**, and **Later**.
4. **Review** completion stats and clear finished work to keep the list calm.

Under the hood it is also a demonstration of a clean multi-layer architecture:
the browser only ever talks to a gateway, the gateway handles auth and
validation, and a separate data layer owns every SQL query. Nothing is mocked —
open the Database page to inspect the schema, indexes, and rows you just created.

---

## Features

### Core todo management
- **Create** tasks via an inline composer or a full dialog (title, notes, priority, due date).
- **Inline rename** — click a task title and edit it in place.
- **Edit details** in a modal (notes, priority, due date).
- **Complete / un-complete** with a single checkbox click.
- **Delete** individual tasks.
- **Clear completed** in bulk.

### Organisation & retrieval
- **Priority levels** — Low, Medium, High, colour-coded.
- **Due dates** with human-friendly labels (`Today`, `Tomorrow`, `3 days ago`, `In 5 days`).
- **Filters** — Open, All, Due today, Overdue.
- **Priority filter** dropdown.
- **Search** across task titles.

### Views
- **Today** — greeting header, live stat tiles, and Overdue / Today / Later buckets.
- **All todos** — the full list with the toolbar of filters and search.
- **Completed** — finished tasks, with a clear-all action.
- **Profile** — name, job title, company, avatar URL, and bio, plus account stats.
- **Settings** — theme, accent colour, reminder toggles, reminder time, plan info.
- **Database** — a live explorer with a table list, Data/Structure tabs, pagination,
  column metadata, and index listings.

### Experience
- **Authentication** — register, sign in, JWT persisted in `localStorage`, route guards.
- **Theming** — Light / Dark / System, plus six accent colours, persisted per user.
- **Toasts** — success / error / info notifications.
- **Responsive shell** — collapsible sidebar with a mobile scrim.
- **Marketing site** — hero, features, how-it-works, tech stack, data model, API surface, FAQ, and footer.

---

## Tech stack

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Client | React 19, React Router 7, Context API, Create React App (`react-scripts`) | SPA, routing, auth/theme/toast state |
| Gateway | Express | JWT auth, validation, REST surface, proxies `/api` |
| Data layer | PHP + PDO | Only component that talks to the database; JSON action router |
| Database | MySQL / MariaDB (InnoDB) | `users`, `todos`, `user_settings` with foreign keys and indexes |

> Only the **client** lives in this repository. The Express gateway, PHP data
> layer, and database are external services the client expects at `/api`.

---

## Architecture

```
Browser (React SPA)
        │  fetch("/api/...") + Bearer <JWT>
        ▼
Express gateway        ← auth, validation, routing
        │
        ▼
PHP data layer (PDO)   ← all SQL, prepared statements, password hashing
        │
        ▼
MySQL / MariaDB        ← users · todos · user_settings
```

Each layer has exactly one job. The client never touches SQL, and PHP never
handles HTTP concerns. Any layer can be swapped without changing the others.

---

## Project structure

```
TaskFlow/
├── public/
│   ├── index.html          # HTML shell (mounts #root)
│   ├── manifest.json       # PWA manifest
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Shell.js            # Authenticated layout wrapper (sidebar + outlet)
│   │   ├── Sidebar.js          # App navigation + user chip + sign out
│   │   ├── Topbar.js           # Page title, theme toggle, avatar
│   │   ├── TodoForm.js         # Quick composer + create/edit dialog
│   │   ├── TodoItem.js         # Single row: toggle, inline rename, badges, actions
│   │   ├── TodoList.js         # List + shared edit dialog + empty/loading states
│   │   ├── ui.js               # Avatar, Badge, Stat, Switch, Modal, EmptyState, Loading
│   │   └── MarketingLayout.js  # Public header + footer
│   ├── context/
│   │   ├── AuthContext.js      # Session, login/register/logout, settings
│   │   ├── ThemeContext.js     # Theme + accent colour
│   │   └── ToastContext.js     # Toast notifications + theme effect
│   ├── lib/
│   │   ├── api.js              # fetch wrapper: bearer token + { ok, data } unwrap
│   │   ├── useTodos.js         # useTodos (CRUD) + useStats hooks
│   │   └── format.js           # Date / due-label / greeting helpers
│   ├── pages/
│   │   ├── Home.js             # Marketing landing page
│   │   ├── Login.js            # Sign in (demo credentials pre-filled)
│   │   ├── Register.js         # Create account
│   │   ├── Today.js            # Today-first dashboard
│   │   ├── Todos.js            # All todos + filters/search
│   │   ├── Completed.js        # Completed tasks
│   │   ├── Profile.js          # Profile editing + stats
│   │   ├── Settings.js         # Appearance, reminders, account
│   │   └── Database.js         # Live database explorer
│   ├── App.js                  # Routes + Protected / PublicOnly guards
│   ├── index.js                # Providers + root render
│   ├── index.css               # Global stylesheet (marketing + app shell)
│   ├── App.css                 # Default CRA styles
│   ├── setupTests.js           # Jest DOM setup
│   ├── reportWebVitals.js      # CRA web-vitals hook
│   └── App.test.js             # Smoke test
├── package.json
├── package-lock.json
└── .gitignore
```

---

## Prerequisites

- **Node.js** 18+ (developed against Node 24) and **npm** 9+.
- A running **TaskFlow API** at `/api` for full functionality — the Express
  gateway, PHP data layer, and MySQL database. Without it, the marketing page
  loads but sign-in and data actions will fail (see
  [Backend & the `/api` contract](#backend--the-api-contract)).

Check your versions:

```bash
node -v
npm -v
```

---

## Setup & installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/pratikbug24/TaskFlow.git
   cd TaskFlow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **(Optional) Point the client at a backend** — see
   [Backend & the `/api` contract](#backend--the-api-contract). By default the
   app calls `/api` on the same origin.

4. **Start the dev server**

   ```bash
   npm start
   ```

   The app opens at [http://localhost:3000](http://localhost:3000).

---

## Running the app

```bash
# Development server with hot reload (http://localhost:3000)
npm start

# Production build → ./build
npm run build

# Run the test runner in watch mode
npm test
```

To preview a production build locally you can serve the `build/` directory with
any static file server, for example:

```bash
npx serve -s build
```

---

## Backend & the `/api` contract

The client makes every request through `src/lib/api.js`, which prefixes paths
with `/api`, attaches `Authorization: Bearer <JWT>` when a token is stored, and
expects a JSON envelope:

```jsonc
// Success
{ "ok": true, "data": <payload> }

// Failure
{ "ok": false, "error": "Human readable message" }
```

Because the client uses a relative `/api` prefix, in development you typically
point it at your gateway using one of these approaches:

- **CRA proxy** — add a `proxy` field to `package.json`:

  ```json
  "proxy": "http://localhost:8080"
  ```

- **Environment variable** — set `REACT_APP_API_URL` (see [Configuration](#configuration))
  if your build reads it, or reverse-proxy `/api` to the gateway.
- **Same-origin deployment** — serve the built SPA and the API from one host so
  `/api` resolves to the gateway directly.

Without a backend the public marketing page still renders, but registration,
login, todos, profile, settings, and the database explorer will show error
toasts.

---

## API reference

All endpoints are relative to `/api` and require a bearer token unless noted.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | No | Create an account; returns token, user, settings |
| `POST` | `/api/auth/login` | No | Sign in; returns token, user, settings |
| `GET` | `/api/auth/me` | Yes | Current user and settings |
| `GET` | `/api/todos` | Yes | List todos. Query: `filter`, `priority`, `search` |
| `POST` | `/api/todos` | Yes | Create a todo |
| `PATCH` | `/api/todos/:id` | Yes | Update fields or toggle `completed` |
| `DELETE` | `/api/todos/:id` | Yes | Delete a todo |
| `POST` | `/api/todos/clear-completed` | Yes | Delete all completed todos; returns `{ deleted }` |
| `GET` | `/api/profile/stats` | Yes | Aggregated counts: total, active, completed, dueToday, overdue, completionRate |
| `PATCH` | `/api/profile` | Yes | Update name, jobTitle, company, bio, avatarUrl |
| `PATCH` | `/api/settings` | Yes | Update theme, accentColor, reminders, reminderTime |
| `GET` | `/api/database/tables` | Yes | Table list with row counts and sizes |
| `GET` | `/api/database/tables/:name` | Yes | Columns and indexes for a table |
| `GET` | `/api/database/tables/:name/rows` | Yes | Paginated rows. Query: `limit`, `offset` |

`filter` accepts `active`, `all`, `today`, or `overdue`. `priority` accepts
`low`, `medium`, or `high`.

---


## Available scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `start` | `react-scripts start` | Dev server with hot reload |
| `build` | `react-scripts build` | Production bundle in `build/` |
| `test` | `react-scripts test` | Jest test runner (watch mode) |
| `eject` | `react-scripts eject` | Eject CRA config (irreversible) |

---

## Testing

```bash
npm test
```

Tests use Jest with React Testing Library. `src/setupTests.js` loads
`@testing-library/jest-dom` matchers. Add focused tests next to the code you
change, for example:

```
src/components/TodoItem.test.js
src/lib/format.test.js
```

> Note: the bundled `src/App.test.js` is the default CRA smoke test and does not
> match the current app; update or replace it when you add real tests.

---

## Problems & solutions (troubleshooting)

### 1. `npm install` fails or takes very long
- **Cause:** stale lockfile or a slow registry.
- **Solution:** ensure you are on Node 18+. Delete `node_modules` and
  `package-lock.json` only as a last resort, then reinstall. Use `npm ci` for a
  clean, lockfile-exact install:

  ```bash
  rm -rf node_modules && npm ci
  ```

### 2. The app loads but sign-in shows a "Request failed" toast
- **Cause:** no backend is reachable at `/api`.
- **Solution:** start the Express gateway + PHP data layer and point the client
  at it with a CRA `proxy` or a same-origin deployment. Confirm the gateway
  responds:

  ```bash
  curl -i http://localhost:8080/api/auth/me
  ```

### 3. `401 Unauthorized` after signing in
- **Cause:** expired or stale JWT in `localStorage`.
- **Solution:** sign out (clears `taskflow.token`) and sign in again. In dev you
  can also clear the token manually from the browser's Application → Local Storage.

### 4. CORS errors in the console
- **Cause:** the SPA and the API are on different origins without CORS headers.
- **Solution:** prefer a same-origin `proxy` so the browser only ever talks to
  one origin. If you must call cross-origin, enable CORS on the gateway and allow
  the `Authorization` header.

### 5. Refreshing a deep link returns 404
- **Cause:** a static host does not know about client-side routes.
- **Solution:** configure a SPA fallback so unknown paths serve `index.html`
  (for example `npx serve -s build`, or a rewrite rule on your host).

### 6. Dark theme does not persist
- **Cause:** not signed in (theme is only persisted to the server for signed-in
  users) or `localStorage` is blocked.
- **Solution:** the choice is stored locally as `taskflow.theme`; sign in to sync
  it across devices, and allow site storage in the browser.

### 7. Port 3000 already in use
- **Cause:** another process is bound to the dev port.
- **Solution:** start on a different port:

  ```bash
  PORT=3001 npm start
  ```

### 8. `react-scripts` / OpenSSL error on newer Node
- **Cause:** older toolchains against very new Node versions.
- **Solution:** use Node 18–20 LTS, or set
  `NODE_OPTIONS=--openssl-legacy-provider` for the dev/build command.

---

## Roadmap / ideas

- **Recurring tasks** — daily/weekly repeats with automatic roll-over.
- **Subtasks & checklists** — break a task into steps.
- **Tags** — free-form labels beyond priority.
- **Drag-to-reorder** — manual ordering within Today.
- **Real reminder delivery** — email/push for daily reminders and weekly summaries.
- **Keyboard-first command palette** — jump to views and create tasks by typing.
- **Import / export** — JSON and CSV round-trips.
- **Offline mode** — service worker + background sync.
- **Bulk actions** — multi-select to complete, reschedule, or delete.
- **Accessibility pass** — audit focus order, ARIA roles, and contrast.
- **Tests** — replace the default smoke test with real component/lib coverage.

---

## FAQ

**Is this a real full-stack application?**
Yes. The React client talks to an Express gateway, which calls a PHP data layer
that reads and writes MySQL. There are no mocked endpoints — open the Database
page to see the rows you just created.

**Why PHP in the middle?**
It demonstrates a gateway-plus-service architecture: the gateway handles auth
and validation, while PHP owns all SQL through PDO prepared statements. Either
layer can be swapped without touching the client.

**Does it support teams or shared projects?**
No, and that is deliberate. TaskFlow is a simple personal todo list — one
account, one private list.

**How is my data stored?**
Everything lives in three InnoDB tables. Todos are linked to your account with a
cascading foreign key, so deleting an account removes its tasks and settings.

**Can I try it without signing up?**
Yes. The sign-in form is pre-filled with a demo account — just press Sign in.

---

## Contributing

1. Fork the repository and create a feature branch.
2. Keep changes focused and consistent with the existing style (see
   `src/index.css` tokens and the `components/`, `pages/`, `lib/`, `context/`
   layout).
3. Run `npm test` and `npm run build` before opening a pull request.
4. Describe what changed and why in the pull request.

---

## License

This project is provided as a demo. Add a license file (for example MIT) if you
intend to distribute it.
