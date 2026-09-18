import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api, { readError } from '../../api/client';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';
import './Leads.css';

const STATUSES = ['NEW', 'CONTACTED', 'IN_DISCUSSION', 'PROPOSAL', 'COMPLETED', 'CLOSED'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

const LeadDetail = () => {
  const { id } = useParams();
  const { can } = useAuth();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [note, setNote] = useState('');
  const [feedback, setFeedback] = useState(null);

  const load = () =>
    api
      .get(`/leads/${id}`)
      .then(({ data }) => setLead(data.lead))
      .catch((error) => setFeedback({ type: 'error', text: readError(error) }));

  useEffect(() => {
    load();
    api.get('/admin/users').then(({ data }) => setAdmins(data.users || [])).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const update = async (body) => {
    try {
      const { data } = await api.put(`/leads/${id}`, body);
      setLead(data.lead);
      setFeedback({ type: 'ok', text: 'Lead updated.' });
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    try {
      const { data } = await api.post(`/leads/${id}/notes`, { text: note });
      setLead(data.lead);
      setNote('');
      setFeedback({ type: 'ok', text: 'Note added.' });
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete this lead permanently?')) return;
    await api.delete(`/leads/${id}`);
    navigate('/admin/leads');
  };

  if (!lead) return <Loader label="Loading lead" />;

  return (
    <div className="admin-page">
      <div>
        <Link to="/admin/leads" className="lead-detail__back">← Back to leads</Link>
        <div className="admin-head">
          <div>
            <h1>{lead.name}</h1>
            <p>{lead.leadId} · received {new Date(lead.createdAt).toLocaleString('en-IN')}</p>
          </div>
          {can('SUPER_ADMIN', 'ADMIN') && (
            <div className="admin-head__actions">
              <button type="button" className="a-btn a-btn--danger" onClick={remove}>Delete lead</button>
            </div>
          )}
        </div>
      </div>

      {feedback && (
        <div className={`admin-alert admin-alert--${feedback.type === 'ok' ? 'ok' : 'error'}`}>{feedback.text}</div>
      )}

      <div className="lead-detail">
        <div className="admin-card">
          <div className="admin-card__head"><h2>Enquiry details</h2></div>
          <dl className="lead-detail__meta">
            <div className="lead-detail__row"><dt>Company</dt><dd>{lead.company || '—'}</dd></div>
            <div className="lead-detail__row"><dt>Email</dt><dd><a href={`mailto:${lead.email}`}>{lead.email}</a></dd></div>
            <div className="lead-detail__row"><dt>Phone</dt><dd>{lead.phone ? <a href={`tel:${lead.phone}`}>{lead.phone}</a> : '—'}</dd></div>
            <div className="lead-detail__row"><dt>Service</dt><dd>{lead.service || '—'}</dd></div>
            <div className="lead-detail__row"><dt>Requirement</dt><dd>{lead.requirement || '—'}</dd></div>
            <div className="lead-detail__row"><dt>Timeline</dt><dd>{lead.timeline || '—'}</dd></div>
            <div className="lead-detail__row"><dt>Source</dt><dd>{lead.source.replace('_', ' ').toLowerCase()}</dd></div>
            <div className="lead-detail__row">
              <dt>Message</dt>
              <dd><div className="lead-detail__message">{lead.message || 'No message provided.'}</div></dd>
            </div>
          </dl>
        </div>

        <div className="admin-page">
          <div className="admin-card">
            <div className="admin-card__head"><h2>Manage</h2></div>
            <div className="admin-field">
              <label htmlFor="d-status">Status</label>
              <select id="d-status" value={lead.status} onChange={(e) => update({ status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="d-priority">Priority</label>
              <select id="d-priority" value={lead.priority} onChange={(e) => update({ priority: e.target.value })}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="d-assign">Assigned to</label>
              <select id="d-assign" value={lead.assignedTo?._id || ''} onChange={(e) => update({ assignedTo: e.target.value || '' })}>
                <option value="">Unassigned</option>
                {admins.map((a) => <option key={a._id} value={a._id}>{a.name} · {a.role.replace('_', ' ').toLowerCase()}</option>)}
              </select>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card__head"><h2>Notes</h2></div>
            {lead.notes?.length > 0 ? (
              <div className="lead-notes">
                {[...lead.notes].reverse().map((n) => (
                  <div key={n._id} className="lead-note">
                    <p>{n.text}</p>
                    <span>{n.addedByName || 'Admin'} · {new Date(n.createdAt).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="admin-field__hint">No notes yet. Record what was discussed so the next person has context.</p>
            )}
            <form onSubmit={addNote}>
              <div className="admin-field">
                <label htmlFor="d-note">Add a note</label>
                <textarea id="d-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What was discussed or agreed?" />
              </div>
              <button type="submit" className="a-btn a-btn--primary" disabled={!note.trim()}>Save note</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
