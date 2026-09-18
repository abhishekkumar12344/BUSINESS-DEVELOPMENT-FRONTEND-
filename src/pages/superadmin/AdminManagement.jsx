import { useCallback, useEffect, useState } from 'react';
import api, { readError } from '../../api/client';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  { value: 'SUPER_ADMIN', label: 'Super admin' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'CONTENT_MANAGER', label: 'Content manager' },
  { value: 'PROJECT_MANAGER', label: 'Project manager' }
];

const blank = { name: '', email: '', password: '', role: 'ADMIN', phone: '', designation: '', isActive: true };

/** Create, edit and disable the accounts that can sign in to the panel. */
const AdminManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.users || []);
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setForm(blank); setEditing('new'); };
  const openEdit = (account) => {
    setForm({ ...blank, ...account, password: '' });
    setEditing(account);
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editing === 'new') {
        await api.post('/admin/users', form);
        setFeedback({ type: 'ok', text: `${form.name} can now sign in.` });
      } else {
        const body = { ...form };
        if (!body.password) delete body.password;
        await api.put(`/admin/users/${editing._id}`, body);
        setFeedback({ type: 'ok', text: 'Account updated.' });
      }
      setEditing(null);
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (account) => {
    try {
      await api.put(`/admin/users/${account._id}`, { isActive: !account.isActive });
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    }
  };

  const remove = async (account) => {
    if (!window.confirm(`Delete the account for ${account.name}? They will lose access immediately.`)) return;
    try {
      await api.delete(`/admin/users/${account._id}`);
      setFeedback({ type: 'ok', text: 'Account deleted.' });
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>Admin management</h1>
          <p>Accounts that can sign in, and what each one is allowed to do.</p>
        </div>
        <div className="admin-head__actions">
          <button type="button" className="a-btn a-btn--primary" onClick={openNew}>Add account</button>
        </div>
      </div>

      {feedback && (
        <div className={`admin-alert admin-alert--${feedback.type === 'ok' ? 'ok' : 'error'}`}>{feedback.text}</div>
      )}

      {loading ? (
        <Loader label="Loading accounts" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Last sign in</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {users.map((account) => (
                <tr key={account._id}>
                  <td>
                    <span className="admin-table__strong">
                      {account.name}{account._id === user?._id ? ' (you)' : ''}
                    </span>
                    <span className="admin-table__sub">{account.email}</span>
                  </td>
                  <td>{ROLES.find((r) => r.value === account.role)?.label || account.role}</td>
                  <td>{account.phone || '—'}</td>
                  <td>{account.lastLogin ? new Date(account.lastLogin).toLocaleString('en-IN') : 'Never'}</td>
                  <td>
                    <span className={`badge badge--${account.isActive ? 'success' : 'muted'}`}>
                      {account.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" className="a-btn a-btn--ghost a-btn--sm" onClick={() => openEdit(account)}>Edit</button>
                      {account._id !== user?._id && (
                        <>
                          <button type="button" className="a-btn a-btn--gold a-btn--sm" onClick={() => toggleActive(account)}>
                            {account.isActive ? 'Disable' : 'Enable'}
                          </button>
                          <button type="button" className="a-btn a-btn--danger a-btn--sm" onClick={() => remove(account)}>Delete</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <>
          <button type="button" className="modal-backdrop" onClick={() => setEditing(null)} aria-label="Close" />
          <div className="modal" role="dialog" aria-modal="true" aria-label="Account">
            <div className="modal__head">
              <h2>{editing === 'new' ? 'Add account' : `Edit ${editing.name}`}</h2>
              <button type="button" className="modal__close" onClick={() => setEditing(null)} aria-label="Close">×</button>
            </div>

            <form onSubmit={save}>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label htmlFor="acc-name">Full name</label>
                  <input id="acc-name" value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="admin-field">
                  <label htmlFor="acc-email">Email</label>
                  <input
                    id="acc-email"
                    type="email"
                    value={form.email}
                    required
                    disabled={editing !== 'new'}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  {editing !== 'new' && <span className="admin-field__hint">The sign-in email cannot be changed.</span>}
                </div>
                <div className="admin-field">
                  <label htmlFor="acc-role">Role</label>
                  <select id="acc-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div className="admin-field">
                  <label htmlFor="acc-password">{editing === 'new' ? 'Password' : 'New password'}</label>
                  <input
                    id="acc-password"
                    type="password"
                    value={form.password}
                    required={editing === 'new'}
                    minLength={8}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <span className="admin-field__hint">
                    {editing === 'new' ? 'At least 8 characters.' : 'Leave blank to keep the current password.'}
                  </span>
                </div>
                <div className="admin-field">
                  <label htmlFor="acc-phone">Phone</label>
                  <input id="acc-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="admin-field">
                  <label htmlFor="acc-designation">Designation</label>
                  <input id="acc-designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
                </div>
                <div className="admin-field admin-field--check">
                  <label>
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                    Account can sign in
                  </label>
                </div>
              </div>

              <div className="modal__foot">
                <button type="button" className="a-btn a-btn--ghost" onClick={() => setEditing(null)}>Cancel</button>
                <button type="submit" className="a-btn a-btn--primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save account'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminManagement;
