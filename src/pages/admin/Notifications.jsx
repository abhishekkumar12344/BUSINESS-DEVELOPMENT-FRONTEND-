import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { readError } from '../../api/client';
import Loader from '../../components/Loader';

const TYPE_LABEL = {
  LEAD: 'New lead',
  CONSULTATION: 'Consultation',
  SYSTEM: 'System',
  ALERT: 'Alert',
  INFO: 'Update'
};

const timeAgo = (date) => {
  const minutes = Math.round((Date.now() - new Date(date).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return new Date(date).toLocaleDateString('en-IN');
};

/** Everything the system wants the team to notice, newest first. */
const Notifications = () => {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/notifications');
      setItems(data.items || []);
      setUnread(data.unread || 0);
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id) => {
    try {
      await api.put(`/admin/notifications/${id}/read`);
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    }
  };

  const markAll = async () => {
    try {
      await api.put('/admin/notifications/read-all');
      setFeedback({ type: 'ok', text: 'All notifications marked as read.' });
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/admin/notifications/${id}`);
      load();
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>Notifications</h1>
          <p>{unread > 0 ? `${unread} unread` : 'Everything here has been read.'}</p>
        </div>
        {unread > 0 && (
          <div className="admin-head__actions">
            <button type="button" className="a-btn a-btn--ghost" onClick={markAll}>Mark all as read</button>
          </div>
        )}
      </div>

      {feedback && (
        <div className={`admin-alert admin-alert--${feedback.type === 'ok' ? 'ok' : 'error'}`}>{feedback.text}</div>
      )}

      {loading ? (
        <Loader label="Loading notifications" />
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <h3>Nothing to catch up on</h3>
          <p>New enquiries, consultation requests and system messages will show up here.</p>
        </div>
      ) : (
        <ul className="notif-list">
          {items.map((item) => (
            <li key={item._id} className={`notif ${item.isRead ? '' : 'notif--unread'}`}>
              <span className={`badge badge--${item.isRead ? 'muted' : 'new'}`}>{TYPE_LABEL[item.type] || item.type}</span>
              <div className="notif__body">
                <strong>{item.title}</strong>
                <p>{item.message}</p>
                <span className="admin-table__sub">{timeAgo(item.createdAt)}</span>
              </div>
              <div className="admin-table__actions">
                {item.link && <Link to={item.link} className="a-btn a-btn--ghost a-btn--sm">Open</Link>}
                {!item.isRead && (
                  <button type="button" className="a-btn a-btn--gold a-btn--sm" onClick={() => markRead(item._id)}>
                    Mark read
                  </button>
                )}
                <button type="button" className="a-btn a-btn--danger a-btn--sm" onClick={() => remove(item._id)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
