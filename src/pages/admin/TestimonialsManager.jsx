import ResourceManager from '../../components/ResourceManager';

const TestimonialsManager = () => (
  <ResourceManager
    title="Testimonials"
    description="Client feedback. Publish a quote only with the client's written permission."
    path="testimonials"
    singular="Testimonial"
    searchKeys={['clientName', 'company', 'quote']}
    emptyTitle="No testimonials yet"
    emptyText="Add a client quote here once you have permission to use it publicly."
    columns={[
      {
        label: 'Client',
        render: (t) => (
          <>
            <span className="admin-table__strong">{t.clientName}</span>
            <span className="admin-table__sub">{[t.designation, t.company].filter(Boolean).join(' · ') || '—'}</span>
          </>
        )
      },
      { label: 'Quote', render: (t) => <span className="admin-table__sub">{t.quote.slice(0, 90)}{t.quote.length > 90 ? '…' : ''}</span> },
      { label: 'Rating', render: (t) => `${t.rating}/5` }
    ]}
    fields={[
      { name: 'clientName', label: 'Client name', required: true },
      { name: 'designation', label: 'Designation' },
      { name: 'company', label: 'Company' },
      { name: 'quote', label: 'Quote', type: 'textarea', required: true },
      { name: 'photo', label: 'Photo', type: 'image', folder: 'testimonials' },
      { name: 'rating', label: 'Rating out of 5', type: 'number', initial: 5 },
      { name: 'order', label: 'Sort order', type: 'number' },
      { name: 'isPublished', label: 'Show on the website', type: 'checkbox' }
    ]}
  />
);

export default TestimonialsManager;
