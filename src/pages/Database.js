import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Topbar from '../components/Topbar.js';
import { api } from '../lib/api.js';
import { useToast } from '../context/ToastContext.js';

const PAGE_SIZE = 25;

function formatBytes(value) {
  if (!value) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const power = Math.min(units.length - 1, Math.floor(Math.log(value) / Math.log(1024)));
  return `${(value / 1024 ** power).toFixed(power === 0 ? 0 : 1)} ${units[power]}`;
}

function Cell({ value }) {
  if (value === null || value === undefined) return <span className="null">NULL</span>;
  if (typeof value === 'object') return <span className="faint">{JSON.stringify(value)}</span>;
  return String(value);
}

export default function Database() {
  const { openNav } = useOutletContext();
  const toast = useToast();

  const [tables, setTables] = useState([]);
  const [active, setActive] = useState(null);
  const [schema, setSchema] = useState(null);
  const [rows, setRows] = useState(null);
  const [offset, setOffset] = useState(0);
  const [tab, setTab] = useState('data');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/database/tables')
      .then((data) => {
        setTables(data);
        setActive((current) => current || data[0]?.name || null);
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [toast]);

  const loadTable = useCallback(
    async (table, nextOffset) => {
      try {
        const [described, page] = await Promise.all([
          api(`/database/tables/${table}`),
          api(`/database/tables/${table}/rows?limit=${PAGE_SIZE}&offset=${nextOffset}`),
        ]);
        setSchema(described);
        setRows(page);
      } catch (error) {
        toast.error(error.message);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (active) loadTable(active, offset);
  }, [active, offset, loadTable]);

  function selectTable(name) {
    setActive(name);
    setOffset(0);
    setTab('data');
  }

  const total = rows?.total ?? 0;
  const canPrev = offset > 0;
  const canNext = offset + PAGE_SIZE < total;

  return (
    <div className="page">
      <Topbar
        title="Database"
        subtitle="Live MySQL/MariaDB — schema, indexes and rows"
        onMenu={openNav}
      />

      {loading ? (
        <div className="card empty small faint">Reading schema…</div>
      ) : (
        <div className="db-layout">
          <aside className="db-tables card">
            <div className="card-title" style={{ marginBottom: 12 }}>Tables</div>
            {tables.map((table) => (
              <button
                key={table.name}
                className={`db-table${active === table.name ? ' active' : ''}`}
                onClick={() => selectTable(table.name)}
              >
                <span className="db-table-name">⛁ {table.name}</span>
                <span className="db-table-rows">{table.rows}</span>
              </button>
            ))}
            <div className="db-note small faint">
              {tables.reduce((sum, table) => sum + table.rows, 0)} rows across {tables.length} tables
            </div>
          </aside>

          <section className="card db-main">
            <div className="card-header">
              <div>
                <div className="card-title">{active}</div>
                <div className="card-subtitle">
                  {schema ? `${schema.columns.length} columns · ${schema.indexes.length} indexes` : ''}
                </div>
              </div>
              <div className="segmented">
                <button className={tab === 'data' ? 'active' : ''} onClick={() => setTab('data')}>Data</button>
                <button className={tab === 'structure' ? 'active' : ''} onClick={() => setTab('structure')}>Structure</button>
              </div>
            </div>

            {tab === 'data' ? (
              <>
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {(schema?.columns || []).map((column) => (
                          <th key={column.name}>
                            {column.name}
                            <span className="col-type">{column.type}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(rows?.rows || []).map((row, index) => (
                        <tr key={index}>
                          {(schema?.columns || []).map((column) => (
                            <td key={column.name}>
                              <Cell value={row[column.name]} />
                            </td>
                          ))}
                        </tr>
                      ))}
                      {rows && rows.rows.length === 0 ? (
                        <tr>
                          <td colSpan={schema?.columns.length || 1} className="empty small faint">
                            No rows in this table.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>

                <div className="db-pager">
                  <span className="small faint">
                    {total === 0 ? '0 rows' : `${offset + 1}–${Math.min(offset + PAGE_SIZE, total)} of ${total}`}
                  </span>
                  <div className="row">
                    <button className="btn" disabled={!canPrev} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>
                      Previous
                    </button>
                    <button className="btn" disabled={!canNext} onClick={() => setOffset(offset + PAGE_SIZE)}>
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Column</th>
                        <th>Type</th>
                        <th>Nullable</th>
                        <th>Key</th>
                        <th>Default</th>
                        <th>Extra</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(schema?.columns || []).map((column) => (
                        <tr key={column.name}>
                          <td><strong>{column.name}</strong></td>
                          <td className="mono">{column.type}</td>
                          <td>{column.nullable ? 'YES' : 'NO'}</td>
                          <td>{column.key || '—'}</td>
                          <td><Cell value={column.default} /></td>
                          <td className="faint">{column.extra || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="card-title" style={{ margin: '20px 0 10px' }}>Indexes</div>
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Column</th>
                        <th>Unique</th>
                        <th>Primary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(schema?.indexes || []).map((index, position) => (
                        <tr key={`${index.name}-${position}`}>
                          <td className="mono">{index.name}</td>
                          <td>{index.column}</td>
                          <td>{index.unique ? 'YES' : 'NO'}</td>
                          <td>{index.primary ? 'YES' : 'NO'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="db-note small faint">
              {active && tables.find((table) => table.name === active)
                ? `Data ${formatBytes(tables.find((t) => t.name === active).dataLength)} · Index ${formatBytes(tables.find((t) => t.name === active).indexLength)} · ${tables.find((t) => t.name === active).engine}`
                : ''}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
