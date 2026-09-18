import ResourceManager from '../../components/ResourceManager';

/** CMS screen for the four core service categories. */
const ServicesManager = () => (
  <ResourceManager
    title="Services"
    description="The service categories behind the Services page, the homepage list and every service detail page."
    path="services"
    singular="Service"
    searchKeys={['title', 'summary']}
    emptyTitle="No services yet"
    emptyText="Run the seed script to load the four categories from the company profile, or add them here one by one."
    columns={[
      { label: '#', render: (s) => <span className="admin-table__id">{s.number || '—'}</span> },
      {
        label: 'Service',
        render: (s) => (
          <>
            <span className="admin-table__strong">{s.title}</span>
            <span className="admin-table__sub">{s.summary || '—'}</span>
          </>
        )
      },
      { label: 'URL', render: (s) => <code>/services/{s.slug}</code> },
      { label: 'Points', render: (s) => (s.points || []).length },
      { label: 'Order', render: (s) => s.order }
    ]}
    fields={[
      { name: 'number', label: 'Number', placeholder: '01', initial: '01', hint: 'The large editorial marker.' },
      { name: 'order', label: 'Sort order', type: 'number' },
      { name: 'title', label: 'Title', required: true, full: true },
      { name: 'summary', label: 'Summary', type: 'textarea', rows: 3, hint: 'One or two lines used in lists and previews.' },
      { name: 'description', label: 'Full description', type: 'textarea', rows: 5 },
      { name: 'points', label: 'What it includes', type: 'list', hint: 'One item per line.' },
      { name: 'outcomes', label: 'Outcomes', type: 'list', hint: 'One item per line. Leave empty if not applicable.' },
      {
        name: 'icon',
        label: 'Icon',
        type: 'select',
        initial: 'project',
        options: [
          { value: 'project', label: 'Project management' },
          { value: 'business', label: 'Business management' },
          { value: 'strategy', label: 'Strategic support' },
          { value: 'coordination', label: 'Coordination & consulting' }
        ]
      },
      { name: 'image', label: 'Image URL', hint: 'Optional. Upload in Media, then paste the URL.' },
      { name: 'seoTitle', label: 'SEO title', full: true },
      { name: 'seoDescription', label: 'SEO description', type: 'textarea', rows: 3 },
      { name: 'isPublished', label: 'Published on the website', type: 'checkbox', initial: true }
    ]}
  />
);

export default ServicesManager;
