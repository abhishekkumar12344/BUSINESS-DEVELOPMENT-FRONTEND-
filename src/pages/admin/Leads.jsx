import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { readError } from '../../api/client';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';
import { serviceOptions } from '../../data/siteContent';
import './Leads.css';

const STATUSES = ['NEW', 'CONTACTED', 'IN_DISCUSSION', 'PROPOSAL', 'COMPLETED', 'CLOSED'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

const Leads = () => {
  const { can } = useAuth();
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [query, setQuery] = useState({ search: '', status: '', priority: '', service: '', sort: '-createdAt', page: 1 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/leads', { params: { ...query, limit: 10 } });
      setLeads(data.leads);
      setPagination(data.pagination);
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(load, query.search ? 350 : 0);
    return () => clearTimeout(timer);
  }, [load, query.search]);

  useEffect(() => {
    api.get('/admin/users').then(({ data }) => setAdmins(data.users || [])).catch(() => {});
  }, []);

  const patch = (partial) => setQuery((q) => ({ ...q, ...partial, page: partial.page || 1 }));

  const updateLead = async (id, body) => {
    try {
      await api.put(`/leads/${id}`, body);
      setFeedback({ type: 'ok', text: 'Lead updated.' });
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    }
  };

  const removeLead = async (id, leadId) => {
    if (!window.confirm(`Delete lead ${leadId}? This also removes its enquiry and consultation records.`)) return;
    try {
      await api.delete(`/leads/${id}`);
      setFeedback({ type: 'ok', text: `Lead ${leadId} deleted.` });
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    }
  };

  const exportCsv = async () => {
    try {
      const response = await api.get('/leads/export', { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `nisha-leads-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error, 'Export failed.') });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>Leads</h1>
          <p>Every contact and consultation submission, with status, priority and ownership.</p>
        </div>
        {can('SUPER_ADMIN', 'ADMIN') && (
          <div className="admin-head__actions">
            <button type="button" className="a-btn a-btn--ghost" onClick={exportCsv}>Export CSV</button>
          </div>
        )}
      </div>

      {feedback && (
        <div className={`admin-alert admin-alert--${feedback.type === 'ok' ? 'ok' : 'error'}`}>{feedback.text}</div>
      )}

      <div>
        <div className="admin-toolbar">
          <input
            className="admin-toolbar__search"
            placeholder="Search name, company, email, phone or lead ID"
            value={query.search}
            onChange={(e) => patch({ search: e.target.value })}
          />
          <select value={query.status} onChange={(e) => patch({ status: e.target.value })}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <select value={query.priority} onChange={(e) => patch({ priority: e.target.value })}>
            <option value="">All priorities</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={query.service} onChange={(e) => patch({ service: e.target.value })}>
            <option value="">All services</option>
            {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={query.sort} onChange={(e) => patch({ sort: e.target.value })}>
            <option value="-createdAt">Newest first</option>
            <option value="createdAt">Oldest first</option>
            <option value="name">Name A–Z</option>
            <option value="-priority">Priority</option>
          </select>
        </div>

        {loading ? (
          <Loader label="Loading leads" />
        ) : leads.length === 0 ? (
          <div className="admin-empty">
            <h3>No leads match this view</h3>
            <p>Clear the filters, or wait for the next enquiry from the website — submissions arrive here instantly.</p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Lead ID</th>
                    <th>Contact</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Assigned</th>
                    <th>Created</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id}>
                      <td className="admin-table__id">{lead.leadId}</td>
                      <td>
                        <span className="admin-table__strong">{lead.name}</span>
                        <span className="admin-table__sub">{lead.company || lead.email}</span>
                      </td>
                      <td>{lead.service || '—'}</td>
                      <td>
                        <select
                          className="lead-select"
                          value={lead.status}
                          onChange={(e) => updateLead(lead._id, { status: e.target.value })}
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                      </td>
                      <td><span className={`badge badge--${lead.priority.toLowerCase()}`}>{lead.priority}</span></td>
                      <td>
                        <select
                          className="lead-select"
                          value={lead.assignedTo?._id || ''}
                          onChange={(e) => updateLead(lead._id, { assignedTo: e.target.value || '' })}
                        >
                          <option value="">Unassigned</option>
                          {admins.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
                        </select>
                      </td>
                      <td>{new Date(lead.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <div className="admin-table__actions">
                          <Link to={`/admin/leads/${lead._id}`} className="a-btn a-btn--ghost a-btn--sm">View</Link>
                          {can('SUPER_ADMIN', 'ADMIN') && (
                            <button
                              type="button"
                              className="a-btn a-btn--danger a-btn--sm"
                              onClick={() => removeLead(lead._id, lead.leadId)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination">
              <span>{pagination.total} leads · page {pagination.page} of {pagination.pages}</span>
              <button type="button" disabled={pagination.page <= 1} onClick={() => patch({ page: pagination.page - 1 })}>
                Previous
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.pages}
                onClick={() => patch({ page: pagination.page + 1 })}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leads;
