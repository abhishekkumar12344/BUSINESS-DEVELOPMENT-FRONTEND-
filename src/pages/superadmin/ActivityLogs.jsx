import { useCallback, useEffect, useState } from 'react';
import api, { readError } from '../../api/client';
import Loader from '../../components/Loader';

const ACTIONS = ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'ASSIGN', 'SETTINGS', 'ADMIN_CREATE', 'EXPORT'];

/** The audit trail: who changed what, from where, and when. */
const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState({ action: '', module: '', page: 1 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/activity', { params: { ...query, limit: 20 } });
      setLogs(data.logs || []);
      setPagination(data.pagination);
    } catch (err) {
      setError(readError(err));
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>Activity logs</h1>
          <p>Every sign in, content change and deletion, kept for accountability.</p>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-toolbar">
        <select value={query.action} onChange={(e) => setQuery((q) => ({ ...q, action: e.target.value, page: 1 }))}>
          <option value="">All actions</option>
          {ACTIONS.map((a) => <option key={a} value={a}>{a.replace('_', ' ')}</option>)}
        </select>
        <input
          className="admin-toolbar__search"
          placeholder="Filter by module, e.g. Services"
          value={query.module}
          onChange={(e) => setQuery((q) => ({ ...q, module: e.target.value, page: 1 }))}
        />
      </div>

      {loading ? (
        <Loader label="Loading activity" />
      ) : logs.length === 0 ? (
        <div className="admin-empty">
          <h3>No activity recorded</h3>
          <p>Actions taken in the admin panel are written here automatically.</p>
        </div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Person</th>
                  <th>Action</th>
                  <th>Module</th>
                  <th>Detail</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td>{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                    <td>
                      <span className="admin-table__strong">{log.userName}</span>
                      <span className="admin-table__sub">{log.userRole?.replace('_', ' ').toLowerCase()}</span>
                    </td>
                    <td><span className={`badge badge--${log.status === 'FAILED' ? 'failed' : 'success'}`}>{log.action}</span></td>
                    <td>{log.module}</td>
                    <td><span className="admin-table__sub">{log.description || '—'}</span></td>
                    <td><span className="admin-table__sub">{log.ipAddress || '—'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-pagination">
            <span>{pagination.total} entries · page {pagination.page} of {pagination.pages}</span>
            <button type="button" disabled={pagination.page <= 1} onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))}>Previous</button>
            <button type="button" disabled={pagination.page >= pagination.pages} onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityLogs;
