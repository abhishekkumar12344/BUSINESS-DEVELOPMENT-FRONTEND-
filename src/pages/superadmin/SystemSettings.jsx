import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { readError } from '../../api/client';
import Loader from '../../components/Loader';

/** Operational controls: API health, maintenance mode and the data checklist. */
const SystemSettings = () => {
  const [health, setHealth] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/health').catch(() => null), api.get('/settings')])
      .then(([healthRes, settingsRes]) => {
        setHealth(healthRes?.data || null);
        setSettings(settingsRes.data.settings);
      })
      .catch((error) => setFeedback({ type: 'error', text: readError(error) }))
      .finally(() => setLoading(false));
  }, []);

  const toggleMaintenance = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/admin/settings', { maintenanceMode: !settings.maintenanceMode });
      setSettings(data.settings);
      setFeedback({
        type: 'ok',
        text: data.settings.maintenanceMode ? 'Maintenance mode is on.' : 'Maintenance mode is off.'
      });
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Checking the system" />;

  const missing = [
    !settings?.contact?.email && 'business email',
    !settings?.contact?.phone && 'business phone',
    !settings?.contact?.website && 'website address'
  ].filter(Boolean);

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>System settings</h1>
          <p>Service health, maintenance mode, and the details still missing from the public site.</p>
        </div>
      </div>

      {feedback && (
        <div className={`admin-alert admin-alert--${feedback.type === 'ok' ? 'ok' : 'error'}`}>{feedback.text}</div>
      )}

      <div className="admin-grid-2">
        <section className="admin-card">
          <div className="admin-card__head"><h2>API</h2></div>
          <p>
            <span className={`badge badge--${health ? 'success' : 'failed'}`}>{health ? 'Reachable' : 'Unreachable'}</span>
          </p>
          <p className="admin-table__sub">
            {health
              ? `${health.service} · checked ${new Date(health.time).toLocaleString('en-IN')}`
              : 'The API did not answer. Start the server and confirm MONGO_URI in server/.env.'}
          </p>
        </section>

        <section className="admin-card">
          <div className="admin-card__head"><h2>Maintenance mode</h2></div>
          <p className="admin-table__sub">
            Turn this on while you rework the public site. Visitors keep seeing the pages; use it as the
            signal to your team that content is mid-change.
          </p>
          <p>
            <span className={`badge badge--${settings?.maintenanceMode ? 'failed' : 'success'}`}>
              {settings?.maintenanceMode ? 'On' : 'Off'}
            </span>
          </p>
          <button type="button" className="a-btn a-btn--gold" onClick={toggleMaintenance} disabled={saving}>
            {saving ? 'Updating…' : settings?.maintenanceMode ? 'Turn off' : 'Turn on'}
          </button>
        </section>
      </div>

      <section className="admin-card">
        <div className="admin-card__head"><h2>Before you go live</h2></div>
        {missing.length === 0 ? (
          <p className="admin-table__sub">Contact details are complete. The footer and contact page are showing real information.</p>
        ) : (
          <>
            <p>The public site is still missing: {missing.join(', ')}.</p>
            <Link to="/admin/settings" className="a-btn a-btn--primary">Add contact details</Link>
          </>
        )}
        <ul className="checklist">
          <li>Set a long, random JWT_SECRET in server/.env.</li>
          <li>Change the seeded super admin password after the first sign in.</li>
          <li>Point CLIENT_URL at the live domain so CORS allows it.</li>
          <li>Take a MongoDB backup before any bulk content change.</li>
        </ul>
      </section>
    </div>
  );
};

export default SystemSettings;
