import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { readError } from '../../api/client';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';

const ROLE_LABEL = {
  SUPER_ADMIN: 'Super admin',
  ADMIN: 'Admin',
  CONTENT_MANAGER: 'Content manager',
  PROJECT_MANAGER: 'Project manager'
};

/** A single view of who has access, what they have been doing, and how the site is performing. */
const SuperAdminHome = () => {
  const { user } = useAuth();
  const [state, setState] = useState({ users: [], logs: [], stats: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/admin/users'),
      api.get('/admin/activity', { params: { limit: 8 } }),
      api.get('/admin/dashboard/stats')
    ])
      .then(([users, activity, stats]) =>
        setState({ users: users.data.users || [], logs: activity.data.logs || [], stats: stats.data.stats })
      )
      .catch((err) => setError(readError(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading control overview" />;
  if (error) return <div className="admin-empty"><h3>Overview unavailable</h3><p>{error}</p></div>;

  const byRole = state.users.reduce((acc, u) => ({ ...acc, [u.role]: (acc[u.role] || 0) + 1 }), {});
  const inactive = state.users.filter((u) => !u.isActive).length;

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>Control overview</h1>
          <p>Signed in as {user?.name}. This panel covers accounts, permissions and the audit trail.</p>
        </div>
        <div className="admin-head__actions">
          <Link to="/super-admin/admins" className="a-btn a-btn--primary">Manage accounts</Link>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-tile">
          <span>Accounts</span>
          <strong>{state.users.length}</strong>
          <em>{inactive} disabled</em>
        </div>
        {Object.keys(ROLE_LABEL).map((role) => (
          <div className="stat-tile stat-tile--plain" key={role}>
            <span>{ROLE_LABEL[role]}</span>
            <strong>{byRole[role] || 0}</strong>
          </div>
        ))}
      </div>

      <div className="admin-grid-2">
        <section className="admin-card">
          <div className="admin-card__head">
            <h2>Accounts</h2>
            <Link to="/super-admin/admins" className="a-btn a-btn--ghost a-btn--sm">Open</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Role</th><th>Last sign in</th></tr>
              </thead>
              <tbody>
                {state.users.slice(0, 6).map((account) => (
                  <tr key={account._id}>
                    <td>
                      <span className="admin-table__strong">{account.name}</span>
                      <span className="admin-table__sub">{account.email}</span>
                    </td>
                    <td><span className="badge badge--muted">{ROLE_LABEL[account.role] || account.role}</span></td>
                    <td>{account.lastLogin ? new Date(account.lastLogin).toLocaleDateString('en-IN') : 'Never'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__head">
            <h2>Recent activity</h2>
            <Link to="/super-admin/activity" className="a-btn a-btn--ghost a-btn--sm">Full log</Link>
          </div>
          {state.logs.length === 0 ? (
            <p className="admin-table__sub">Nothing has been recorded yet.</p>
          ) : (
            <ul className="log-list">
              {state.logs.map((log) => (
                <li key={log._id}>
                  <span className={`badge badge--${log.status === 'FAILED' ? 'failed' : 'success'}`}>{log.action}</span>
                  <div>
                    <strong>{log.description || log.module}</strong>
                    <span className="admin-table__sub">
                      {log.userName} · {new Date(log.createdAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {state.stats && (
        <section className="admin-card">
          <div className="admin-card__head"><h2>Website at a glance</h2></div>
          <div className="stat-row">
            <div className="stat-tile stat-tile--plain"><span>Leads</span><strong>{state.stats.totalLeads}</strong></div>
            <div className="stat-tile stat-tile--plain"><span>Enquiries</span><strong>{state.stats.totalEnquiries}</strong></div>
            <div className="stat-tile stat-tile--plain"><span>Consultations</span><strong>{state.stats.consultations}</strong></div>
            <div className="stat-tile stat-tile--plain"><span>Active projects</span><strong>{state.stats.activeProjects}</strong></div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SuperAdminHome;
