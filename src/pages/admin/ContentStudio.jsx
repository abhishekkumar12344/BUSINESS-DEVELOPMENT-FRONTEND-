import { Link } from 'react-router-dom';
import './admin.css';

const contentModules = [
  {
    title: 'Services',
    description: 'Edit service packages, pricing context and brand positioning.',
    to: '/admin/services'
  },
  {
    title: 'Approach',
    description: 'Manage your process steps and delivery framework.',
    to: '/admin/approach'
  },
  {
    title: 'Values',
    description: 'Update the principles and values that define your brand.',
    to: '/admin/values'
  },
  {
    title: 'Projects',
    description: 'Publish case studies, outcomes and project details.',
    to: '/admin/projects'
  },
  {
    title: 'Testimonials',
    description: 'Add client proof and showcase success stories.',
    to: '/admin/testimonials'
  },
  {
    title: 'Team',
    description: 'Manage founder and leadership profiles and bios.',
    to: '/admin/team'
  },
  {
    title: 'Media',
    description: 'Upload and organize visual content for the website.',
    to: '/admin/media'
  },
  {
    title: 'Insights',
    description: 'Create blog posts, articles and business updates.',
    to: '/admin/insights'
  }
];

const ContentStudio = () => (
  <div className="admin-page">
    <div className="admin-head">
      <div>
        <h1>Website content studio</h1>
        <p>Use this area to manage your website sections, while the admin dashboard remains focused on analysis, leads and operations.</p>
      </div>
      <div className="admin-head__actions">
        <Link to="/admin" className="a-btn a-btn--ghost">Back to dashboard</Link>
      </div>
    </div>

    <section className="admin-card">
      <div className="admin-card__head">
        <h2>Content modules</h2>
      </div>

      <div className="studio-grid">
        {contentModules.map((module) => (
          <div key={module.title} className="studio-card">
            <span className="studio-card__eyebrow">Edit</span>
            <strong>{module.title}</strong>
            <p>{module.description}</p>
            <div className="studio-card__actions">
              <Link to={module.to} className="a-btn a-btn--ghost a-btn--sm">Open</Link>
              <Link to={`${module.to}?mode=new`} className="a-btn a-btn--primary a-btn--sm">Add data</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default ContentStudio;
