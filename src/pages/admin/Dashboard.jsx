import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import Loader from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const statCards = [
  { key: 'totalEnquiries', label: 'Total enquiries', to: '/admin/enquiries' },
  { key: 'newEnquiries', label: 'New enquiries', to: '/admin/enquiries', accent: true },
  { key: 'activeProjects', label: 'Active projects', to: '/admin/projects' },
  { key: 'consultations', label: 'Consultations', to: '/admin/consultations' },
  { key: 'totalLeads', label: 'Total leads', to: '/admin/leads' },
  { key: 'unreadMessages', label: 'Unread messages', to: '/admin/enquiries' }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/dashboard/stats')
      .then(({ data: res }) => setData(res))
      .catch(() => setError('The dashboard could not load. Check that the API and database are running.'));
  }, []);

  if (error) return <div className="admin-alert admin-alert--error">{error}</div>;
  if (!data) return <Loader label="Loading dashboard" />;

  const { stats, charts, recentLeads, recentActivity } = data;
  const maxMonthly = Math.max(...charts.monthly.data, 1);
  const statusEntries = Object.entries(charts.statusBreakdown || {});
  const statusTotal = statusEntries.reduce((sum, [, n]) => sum + n, 0);

  return (
    <div className="admin-page dashboard">
      <div className="admin-head">
        <div>
          <h1>Good to see you, {user?.name?.split(' ')[0]}.</h1>
          <p>Every figure below is read live from the database. Nothing here is a sample number.</p>
        </div>
        <div className="admin-head__actions">
          <Link to="/admin/leads" className="a-btn a-btn--ghost">Open leads</Link>
          <Link to="/admin/settings" className="a-btn a-btn--primary">Website settings</Link>
        </div>
      </div>

      <div className="dash-stats">
        {statCards.map((card) => (
          <Link key={card.key} to={card.to} className={`dash-stat ${card.accent ? 'dash-stat--accent' : ''}`}>
            <p className="dash-stat__num">{stats[card.key] ?? 0}</p>
            <p className="dash-stat__label">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="dash-grid">
        <section className="admin-card dash-chart">
          <div className="admin-card__head">
            <h2>Leads received, last 6 months</h2>
            <span className="dash-chart__total">{charts.monthly.data.reduce((a, b) => a + b, 0)} total</span>
          </div>
          <div className="dash-bars">
            {charts.monthly.labels.map((label, i) => {
              const value = charts.monthly.data[i];
              return (
                <div key={label + i} className="dash-bar">
                  <span className="dash-bar__value">{value}</span>
                  <span
                    className="dash-bar__fill"
                    style={{ height: `${Math.max((value / maxMonthly) * 100, 3)}%` }}
                    title={`${value} leads in ${label}`}
                  />
                  <span className="dash-bar__label">{label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="admin-card dash-status">
          <div className="admin-card__head">
            <h2>Leads by status</h2>
          </div>
          {statusTotal === 0 ? (
            <p className="dash-muted">No leads yet. They will appear here as soon as the first form is submitted.</p>
          ) : (
            <ul className="dash-status__list">
              {statusEntries.map(([status, count]) => (
                <li key={status}>
                  <span className={`badge badge--${status.toLowerCase()}`}>{status.replace('_', ' ')}</span>
                  <span className="dash-status__track">
                    <span style={{ width: `${(count / statusTotal) * 100}%` }} />
                  </span>
                  <strong>{count}</strong>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="dash-grid">
        <section className="admin-card">
          <div className="admin-card__head">
            <h2>Recent leads</h2>
            <Link to="/admin/leads" className="a-btn a-btn--ghost a-btn--sm">View all</Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="dash-muted">No leads yet. Submissions from the contact and consultation forms land here.</p>
          ) : (
            <ul className="dash-leads">
              {recentLeads.map((lead) => (
                <li key={lead._id}>
                  <Link to={`/admin/leads/${lead._id}`}>
                    <span className="dash-leads__name">
                      {lead.name}
                      <em>{lead.company || lead.email}</em>
                    </span>
                    <span className="dash-leads__meta">
                      <span className={`badge badge--${lead.status.toLowerCase()}`}>{lead.status.replace('_', ' ')}</span>
                      <time>{new Date(lead.createdAt).toLocaleDateString('en-IN')}</time>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-card">
          <div className="admin-card__head">
            <h2>Recent activity</h2>
          </div>
          {recentActivity.length === 0 ? (
            <p className="dash-muted">Activity will be recorded here as your team works in the panel.</p>
          ) : (
            <ul className="dash-activity">
              {recentActivity.map((log) => (
                <li key={log._id}>
                  <span className={`dash-activity__dot dash-activity__dot--${log.status.toLowerCase()}`} />
                  <span>
                    <strong>{log.userName}</strong> {log.description || `${log.action.toLowerCase()} in ${log.module}`}
                    <em>{new Date(log.createdAt).toLocaleString('en-IN')}</em>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {charts.serviceBreakdown.length > 0 && (
        <section className="admin-card">
          <div className="admin-card__head">
            <h2>Interest by service</h2>
          </div>
          <ul className="dash-services">
            {charts.serviceBreakdown.map((row) => (
              <li key={row.service}>
                <span>{row.service}</span>
                <strong>{row.count}</strong>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
