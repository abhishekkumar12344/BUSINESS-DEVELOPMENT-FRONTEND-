import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { readError } from '../../api/client';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';

/** Contact-form messages from the website, newest first. */
const Enquiries = () => {
  const { can } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [open, setOpen] = useState(null);
  const [query, setQuery] = useState({ search: '', page: 1 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/enquiries', { params: { ...query, limit: 10 } });
      setEnquiries(data.enquiries || []);
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

  const toggleRead = async (enquiry) => {
    try {
      await api.put(`/admin/enquiries/${enquiry._id}/read`);
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    }
  };

  const remove = async (enquiry) => {
    if (!window.confirm(`Delete the message from ${enquiry.name}?`)) return;
    try {
      await api.delete(`/admin/enquiries/${enquiry._id}`);
      setFeedback({ type: 'ok', text: 'Enquiry deleted.' });
      setOpen(null);
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>Enquiries</h1>
          <p>Messages sent through the contact form. Each one also creates a lead record.</p>
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
          onChange={(e) => setQuery({ search: e.target.value, page: 1 })}
        />
      </div>

      {loading ? (
        <Loader label="Loading enquiries" />
      ) : enquiries.length === 0 ? (
        <div className="admin-empty">
          <h3>No enquiries yet</h3>
          <p>Messages from the website contact form land here the moment they are sent.</p>
        </div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Service</th>
                  <th>Message</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry) => (
                  <tr key={enquiry._id}>
                    <td>
                      <span className="admin-table__strong">{enquiry.name}</span>
                      <span className="admin-table__sub">{enquiry.company || enquiry.email}</span>
                    </td>
                    <td>{enquiry.service || '—'}</td>
                    <td>
                      <span className="admin-table__sub">
                        {enquiry.message.slice(0, 70)}{enquiry.message.length > 70 ? '…' : ''}
                      </span>
                    </td>
                    <td>{new Date(enquiry.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <span className={`badge badge--${enquiry.isRead ? 'muted' : 'new'}`}>
                        {enquiry.isRead ? 'Read' : 'New'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <button type="button" className="a-btn a-btn--ghost a-btn--sm" onClick={() => setOpen(enquiry)}>
                          Read
                        </button>
                        <button type="button" className="a-btn a-btn--gold a-btn--sm" onClick={() => toggleRead(enquiry)}>
                          Mark {enquiry.isRead ? 'unread' : 'read'}
                        </button>
                        {can('SUPER_ADMIN', 'ADMIN') && (
                          <button type="button" className="a-btn a-btn--danger a-btn--sm" onClick={() => remove(enquiry)}>
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
            <span>{pagination.total} enquiries · page {pagination.page} of {pagination.pages}</span>
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
          <div className="modal" role="dialog" aria-modal="true" aria-label="Enquiry">
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
                <label>Service</label>
                <p>{open.service || '—'}</p>
              </div>
              <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                <label>Message</label>
                <p style={{ whiteSpace: 'pre-wrap' }}>{open.message}</p>
              </div>
            </div>

            <div className="modal__foot">
              {open.lead?._id && (
                <Link to={`/admin/leads/${open.lead._id}`} className="a-btn a-btn--ghost">Open lead</Link>
              )}
              <a className="a-btn a-btn--primary" href={`mailto:${open.email}?subject=Re: your enquiry to Nisha Project %26 Business Management`}>
                Reply by email
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Enquiries;
