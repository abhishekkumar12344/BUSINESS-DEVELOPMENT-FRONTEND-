import ResourceManager from '../../components/ResourceManager';

/** CMS screen for the six company values. */
const ValuesManager = () => (
  <ResourceManager
    title="Values"
    description="Integrity, professionalism, accountability, innovation, collaboration and client success — edit the wording and the icon for each."
    path="values"
    singular="Value"
    searchKeys={['title', 'description']}
    emptyTitle="No values yet"
    emptyText="Add the values you want on the About page and the homepage values section."
    columns={[
      {
        label: 'Value',
        render: (v) => (
          <>
            <span className="admin-table__strong">{v.title}</span>
            <span className="admin-table__sub">{v.description || '—'}</span>
          </>
        )
      },
      { label: 'Icon', render: (v) => v.icon },
      { label: 'Order', render: (v) => v.order }
    ]}
    fields={[
      { name: 'title', label: 'Value', required: true },
      { name: 'order', label: 'Sort order', type: 'number' },
      {
        name: 'icon',
        label: 'Icon',
        type: 'select',
        initial: 'integrity',
        options: [
          { value: 'integrity', label: 'Integrity' },
          { value: 'professionalism', label: 'Professionalism' },
          { value: 'accountability', label: 'Accountability' },
          { value: 'innovation', label: 'Innovation' },
          { value: 'collaboration', label: 'Collaboration' },
          { value: 'client-success', label: 'Client success' }
        ]
      },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
      { name: 'isPublished', label: 'Published on the website', type: 'checkbox', initial: true }
    ]}
  />
);

export default ValuesManager;
