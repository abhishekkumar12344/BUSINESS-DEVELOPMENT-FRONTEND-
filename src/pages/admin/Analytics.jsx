import { useEffect, useMemo, useState } from 'react';
import api, { readError } from '../../api/client';
import Loader from '../../components/Loader';

const STATUS_ORDER = ['NEW', 'CONTACTED', 'IN_DISCUSSION', 'PROPOSAL', 'COMPLETED', 'CLOSED'];

/** Enquiry volume, pipeline mix and service demand, drawn from live lead data. */
const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get('/admin/dashboard/stats')
      .then(({ data: payload }) => setData(payload))
      .catch((err) => setError(readError(err)))
      .finally(() => setLoading(false));
  }, []);

  const monthly = data?.charts?.monthly || { labels: [], data: [] };
  const peak = useMemo(() => Math.max(1, ...(monthly.data || [1])), [monthly]);
  const statuses = data?.charts?.statusBreakdown || {};
  const totalLeads = useMemo(() => Object.values(statuses).reduce((a, b) => a + b, 0), [statuses]);
  const services = data?.charts?.serviceBreakdown || [];
  const topService = services[0]?.count || 1;

  if (loading) return <Loader label="Building analytics" />;
  if (error) {
    return (
      <div className="admin-empty">
        <h3>Analytics could not be loaded</h3>
        <p>{error}</p>
      </div>
    );
  }

  const conversion = totalLeads
    ? Math.round((((statuses.COMPLETED || 0) + (statuses.PROPOSAL || 0)) / totalLeads) * 100)
    : 0;

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>Analytics</h1>
          <p>How enquiries are arriving, where they are in the pipeline, and which services are asked for most.</p>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-tile">
          <span>Total leads</span>
          <strong>{data.stats.totalLeads}</strong>
          <em>{data.stats.newLeads} new this month</em>
        </div>
        <div className="stat-tile">
          <span>Enquiries</span>
          <strong>{data.stats.totalEnquiries}</strong>
          <em>{data.stats.unreadMessages} unread</em>
        </div>
        <div className="stat-tile">
          <span>Consultations</span>
          <strong>{data.stats.consultations}</strong>
          <em>{data.stats.newConsultations} awaiting a date</em>
        </div>
        <div className="stat-tile">
          <span>At proposal or won</span>
          <strong>{conversion}%</strong>
          <em>of all leads</em>
        </div>
      </div>

      <section className="admin-card">
        <div className="admin-card__head"><h2>Leads over the last six months</h2></div>
        {monthly.data.every((n) => n === 0) ? (
          <div className="admin-empty"><h3>No leads recorded yet</h3><p>This chart fills in as enquiries arrive from the website.</p></div>
        ) : (
          <div className="chart-bars">
            {monthly.labels.map((label, index) => (
              <div className="chart-bars__col" key={label + index}>
                <span className="chart-bars__value">{monthly.data[index]}</span>
                <div className="chart-bars__bar" style={{ height: `${Math.max(4, (monthly.data[index] / peak) * 100)}%` }} />
                <span className="chart-bars__label">{label}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="admin-grid-2">
        <section className="admin-card">
          <div className="admin-card__head"><h2>Pipeline</h2></div>
          {totalLeads === 0 ? (
            <p className="admin-table__sub">No leads to break down yet.</p>
          ) : (
            <ul className="chart-list">
              {STATUS_ORDER.filter((s) => statuses[s]).map((status) => (
                <li key={status}>
                  <span>{status.replace('_', ' ').toLowerCase()}</span>
                  <div className="chart-list__track">
                    <div className="chart-list__fill" style={{ width: `${(statuses[status] / totalLeads) * 100}%` }} />
                  </div>
                  <strong>{statuses[status]}</strong>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-card">
          <div className="admin-card__head"><h2>Service demand</h2></div>
          {services.length === 0 ? (
            <p className="admin-table__sub">No service has been requested yet.</p>
          ) : (
            <ul className="chart-list">
              {services.map((row) => (
                <li key={row.service}>
                  <span>{row.service}</span>
                  <div className="chart-list__track">
                    <div className="chart-list__fill chart-list__fill--gold" style={{ width: `${(row.count / topService) * 100}%` }} />
                  </div>
                  <strong>{row.count}</strong>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="admin-card">
        <div className="admin-card__head"><h2>Delivery and content</h2></div>
        <div className="stat-row">
          <div className="stat-tile stat-tile--plain">
            <span>Active projects</span>
            <strong>{data.stats.activeProjects}</strong>
          </div>
          <div className="stat-tile stat-tile--plain">
            <span>Completed projects</span>
            <strong>{data.stats.completedProjects}</strong>
          </div>
          <div className="stat-tile stat-tile--plain">
            <span>Published insights</span>
            <strong>{data.stats.publishedBlogs}</strong>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
