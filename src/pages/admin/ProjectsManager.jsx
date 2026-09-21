import ResourceManager from '../../components/ResourceManager';

/**
 * Case studies. Nothing is seeded here — the Projects page stays empty until
 * real work is added, so the website never shows invented results.
 */
const ProjectsManager = () => (
  <ResourceManager
    title="Projects"
    description="Case studies for the Projects page. Records stay private until you publish them, so a project can be drafted while it is still running."
    path="projects"
    singular="Project"
    searchKeys={['title', 'client', 'sector']}
    emptyTitle="No projects yet"
    emptyText="The Projects page will invite visitors to get in touch until you publish your first case study here."
    columns={[
      {
        label: 'Project',
        render: (p) => (
          <>
            <span className="admin-table__strong">{p.title}</span>
            <span className="admin-table__sub">{p.summary || '—'}</span>
          </>
        )
      },
      { label: 'Client', render: (p) => p.client || '—' },
      { label: 'Sector', render: (p) => p.sector || '—' },
      { label: 'Stage', render: (p) => <span className="badge badge--muted">{(p.status || '').replace('_', ' ')}</span> }
    ]}
    fields={[
      { name: 'title', label: 'Project title', required: true, full: true },
      { name: 'client', label: 'Client', hint: 'Leave blank if the client prefers to stay anonymous.' },
      { name: 'sector', label: 'Sector' },
      { name: 'serviceType', label: 'Service type', placeholder: 'Project Management' },
      {
        name: 'status',
        label: 'Stage',
        type: 'select',
        initial: 'ACTIVE',
        options: [
          { value: 'PLANNING', label: 'Planning' },
          { value: 'ACTIVE', label: 'Active' },
          { value: 'ON_HOLD', label: 'On hold' },
          { value: 'COMPLETED', label: 'Completed' }
        ]
      },
      { name: 'startDate', label: 'Start date', type: 'date' },
      { name: 'endDate', label: 'End date', type: 'date' },
      { name: 'summary', label: 'Summary', type: 'textarea', rows: 3 },
      { name: 'challenge', label: 'The challenge', type: 'textarea', rows: 4 },
      { name: 'approach', label: 'Our approach', type: 'textarea', rows: 4 },
      { name: 'outcome', label: 'Outcome', type: 'textarea', rows: 4 },
      { name: 'coverImage', label: 'Cover image', type: 'image', hint: 'Shown on the Projects page and as the featured case study image.' },
      { name: 'order', label: 'Sort order', type: 'number' },
      { name: 'isPublished', label: 'Published on the website', type: 'checkbox' }
    ]}
  />
);

export default ProjectsManager;
