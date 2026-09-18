import { useCallback, useEffect, useState } from 'react';
import api, { readError } from '../../api/client';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';

const STATUSES = ['NEW', 'SCHEDULED', 'DISCUSSED', 'PROPOSAL', 'CLOSED'];

/** Consultation requests, with the meeting date and where each one stands. */
const Consultations = () => {
  const { can } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [open, setOpen] = useState(null);
  const [query, setQuery] = useState({ search: '', status: '', page: 1 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/consultations', { params: { ...query, limit: 10 } });
      setConsultations(data.consultations || []);
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

  const update = async (id, body) => {
    try {
      await api.put(`/admin/consultations/${id}`, body);
      setFeedback({ type: 'ok', text: 'Consultation updated.' });
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    }
  };

  const remove = async (consultation) => {
    if (!window.confirm(`Delete the consultation request from ${consultation.name}?`)) return;
    try {
      await api.delete(`/admin/consultations/${consultation._id}`);
      setFeedback({ type: 'ok', text: 'Consultation deleted.' });
      setOpen(null);
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    }
  };

  const schedule = async (consultation, value) => {
    await update(consultation._id, {
      status: consultation.status === 'NEW' ? 'SCHEDULED' : consultation.status,
      scheduledAt: value || null
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>Consultations</h1>
          <p>Requests for an introductory call, with the stage each conversation has reached.</p>
        </div>
      </div>

      {feedback && (
        <div className={`admin-alert admin-alert--${feedback.type === 'ok' ? 'ok' : 'error'}`}>{feedback.text}</div>
      )}

      <div className="admin-toolbar">
        <input
          className="admin-toolbar__search"
          placeholder="Search name, email or company"
          value={query.search}
          onChange={(e) => setQuery((q) => ({ ...q, search: e.target.value, page: 1 }))}
        />
        <select value={query.status} onChange={(e) => setQuery((q) => ({ ...q, status: e.target.value, page: 1 }))}>
          <option value="">All stages</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <Loader label="Loading consultations" />
      ) : consultations.length === 0 ? (
        <div className="admin-empty">
          <h3>No consultation requests yet</h3>
          <p>Requests booked from the consultation page appear here with their preferred timeline.</p>
        </div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Requested by</th>
                  <th>Service</th>
                  <th>Timeline</th>
                  <th>Meeting</th>
                  <th>Stage</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {consultations.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <span className="admin-table__strong">{item.name}</span>
                      <span className="admin-table__sub">{item.company || item.email}</span>
                    </td>
                    <td>{item.serviceRequired || '—'}</td>
                    <td>{item.timeline || '—'}</td>
                    <td>
                      <input
                        type="datetime-local"
                        value={item.scheduledAt ? new Date(item.scheduledAt).toISOString().slice(0, 16) : ''}
                        onChange={(e) => schedule(item, e.target.value)}
                      />
                    </td>
                    <td>
                      <select value={item.status} onChange={(e) => update(item._id, { status: e.target.value, scheduledAt: item.scheduledAt })}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <button type="button" className="a-btn a-btn--ghost a-btn--sm" onClick={() => setOpen(item)}>
                          View
                        </button>
                        {can('SUPER_ADMIN', 'ADMIN') && (
                          <button type="button" className="a-btn a-btn--danger a-btn--sm" onClick={() => remove(item)}>
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
            <span>{pagination.total} requests · page {pagination.page} of {pagination.pages}</span>
            <button type="button" disabled={pagination.page <= 1} onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))}>
              Previous
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.pages}
              onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
            >
              Next
            </button>
          </div>
        </>
      )}

      {open && (
        <>
          <button type="button" className="modal-backdrop" onClick={() => setOpen(null)} aria-label="Close" />
          <div className="modal" role="dialog" aria-modal="true" aria-label="Consultation request">
            <div className="modal__head">
              <h2>{open.name}</h2>
              <button type="button" className="modal__close" onClick={() => setOpen(null)} aria-label="Close">×</button>
            </div>

            <div className="admin-grid-2">
              <div className="admin-field">
                <label>Email</label>
                <p><a href={`mailto:${open.email}`}>{open.email}</a></p>
              </div>
              <div className="admin-field">
                <label>Phone</label>
                <p>{open.phone ? <a href={`tel:${open.phone}`}>{open.phone}</a> : '—'}</p>
              </div>
              <div className="admin-field">
                <label>Company</label>
                <p>{open.company || '—'}</p>
              </div>
              <div className="admin-field">
                <label>Preferred timeline</label>
                <p>{open.timeline || '—'}</p>
              </div>
              <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                <label>Requirement</label>
                <p style={{ whiteSpace: 'pre-wrap' }}>{open.requirement || open.message || '—'}</p>
              </div>
            </div>

            <div className="modal__foot">
              <a className="a-btn a-btn--primary" href={`mailto:${open.email}?subject=Your consultation with Nisha Project %26 Business Management`}>
                Reply by email
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Consultations;
