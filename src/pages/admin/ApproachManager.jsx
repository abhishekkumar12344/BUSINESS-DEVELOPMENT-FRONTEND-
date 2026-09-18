import ResourceManager from '../../components/ResourceManager';

/** CMS screen for the five-step methodology timeline. */
const ApproachManager = () => (
  <ResourceManager
    title="Approach steps"
    description="Plan, Organize, Execute, Monitor and Deliver — the steps shown on the homepage and on the Our Approach timeline."
    path="approach"
    singular="Step"
    searchKeys={['title', 'description']}
    emptyTitle="No approach steps yet"
    emptyText="Add the steps of your methodology. They appear in the timeline in the sort order you set."
    columns={[
      { label: '#', render: (s) => <span className="admin-table__id">{s.number || '—'}</span> },
      {
        label: 'Step',
        render: (s) => (
          <>
            <span className="admin-table__strong">{s.title}</span>
            <span className="admin-table__sub">{s.description || '—'}</span>
          </>
        )
      },
      { label: 'Order', render: (s) => s.order }
    ]}
    fields={[
      { name: 'number', label: 'Number', placeholder: '01', initial: '01' },
      { name: 'order', label: 'Sort order', type: 'number' },
      { name: 'title', label: 'Step title', required: true, placeholder: 'PLAN', full: true },
      { name: 'description', label: 'Short description', type: 'textarea', rows: 3 },
      { name: 'detail', label: 'Expanded detail', type: 'textarea', rows: 5, hint: 'Shown when a visitor opens the step.' },
      { name: 'isPublished', label: 'Published on the website', type: 'checkbox', initial: true }
    ]}
  />
);

export default ApproachManager;
