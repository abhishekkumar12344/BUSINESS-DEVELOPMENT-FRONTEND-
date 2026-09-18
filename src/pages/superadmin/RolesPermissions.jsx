import { useEffect, useState } from 'react';
import api, { readError } from '../../api/client';
import Loader from '../../components/Loader';

/**
 * A plain-language map of what each role can reach. The rows mirror the
 * authorisation rules enforced by the API, so this page stays honest.
 */
const ROLES = [
  {
    value: 'SUPER_ADMIN',
    label: 'Super admin',
    summary: 'Full control, including other accounts and system settings.'
  },
  {
    value: 'ADMIN',
    label: 'Admin',
    summary: 'Runs the business side: leads, enquiries, content and website settings.'
  },
  {
    value: 'CONTENT_MANAGER',
    label: 'Content manager',
    summary: 'Publishes services, insights, projects and media. No account control.'
  },
  {
    value: 'PROJECT_MANAGER',
    label: 'Project manager',
    summary: 'Works the pipeline: leads, enquiries and consultations only.'
  }
];

const MATRIX = [
  { area: 'Dashboard and analytics', SUPER_ADMIN: 'Full', ADMIN: 'Full', CONTENT_MANAGER: 'Full', PROJECT_MANAGER: 'Full' },
  { area: 'Leads and enquiries', SUPER_ADMIN: 'Full', ADMIN: 'Full', CONTENT_MANAGER: 'View', PROJECT_MANAGER: 'Full' },
  { area: 'Delete a lead or enquiry', SUPER_ADMIN: 'Yes', ADMIN: 'Yes', CONTENT_MANAGER: 'No', PROJECT_MANAGER: 'No' },
  { area: 'Website content and media', SUPER_ADMIN: 'Full', ADMIN: 'Full', CONTENT_MANAGER: 'Full', PROJECT_MANAGER: 'View' },
  { area: 'Website settings', SUPER_ADMIN: 'Full', ADMIN: 'Full', CONTENT_MANAGER: 'No', PROJECT_MANAGER: 'No' },
  { area: 'Activity logs', SUPER_ADMIN: 'Full', ADMIN: 'Full', CONTENT_MANAGER: 'No', PROJECT_MANAGER: 'No' },
  { area: 'Create or delete accounts', SUPER_ADMIN: 'Yes', ADMIN: 'No', CONTENT_MANAGER: 'No', PROJECT_MANAGER: 'No' }
];

const RolesPermissions = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get('/admin/users')
      .then(({ data }) => setUsers(data.users || []))
      .catch((error) => setFeedback({ type: 'error', text: readError(error) }))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const changeRole = async (account, role) => {
    try {
      await api.put(`/admin/users/${account._id}`, { role });
      setFeedback({ type: 'ok', text: `${account.name} is now ${role.replace('_', ' ').toLowerCase()}.` });
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>Roles and permissions</h1>
          <p>What each role can reach, and which role every account currently holds.</p>
        </div>
      </div>

      {feedback && (
        <div className={`admin-alert admin-alert--${feedback.type === 'ok' ? 'ok' : 'error'}`}>{feedback.text}</div>
      )}

      <div className="role-cards">
        {ROLES.map((role) => (
          <article className="role-card" key={role.value}>
            <h2>{role.label}</h2>
            <p>{role.summary}</p>
            <span className="admin-table__sub">
              {users.filter((u) => u.role === role.value).length} account(s)
            </span>
          </article>
        ))}
      </div>

      <section className="admin-card">
        <div className="admin-card__head"><h2>Permission matrix</h2></div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Area</th>
                {ROLES.map((r) => <th key={r.value}>{r.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row) => (
                <tr key={row.area}>
                  <td className="admin-table__strong">{row.area}</td>
                  {ROLES.map((r) => (
                    <td key={r.value}>
                      <span className={`badge badge--${row[r.value] === 'No' ? 'muted' : 'success'}`}>{row[r.value]}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card__head"><h2>Assign roles</h2></div>
        {loading ? (
          <Loader label="Loading accounts" />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Account</th><th>Role</th><th>Status</th></tr>
              </thead>
              <tbody>
                {users.map((account) => (
                  <tr key={account._id}>
                    <td>
                      <span className="admin-table__strong">{account.name}</span>
                      <span className="admin-table__sub">{account.email}</span>
                    </td>
                    <td>
                      <select value={account.role} onChange={(e) => changeRole(account, e.target.value)}>
                        {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </td>
                    <td>
                      <span className={`badge badge--${account.isActive ? 'success' : 'muted'}`}>
                        {account.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default RolesPermissions;
