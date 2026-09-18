import ResourceManager from '../../components/ResourceManager';

const TeamManager = () => (
  <ResourceManager
    title="Team"
    description="People shown on the team page, in the order you set here."
    path="team"
    singular="Team member"
    searchKeys={['name', 'designation']}
    emptyTitle="No team members yet"
    emptyText="Add the people you want to introduce on the website, then publish each profile."
    columns={[
      {
        label: 'Name',
        render: (m) => (
          <>
            <span className="admin-table__strong">{m.name}</span>
            <span className="admin-table__sub">{m.designation || '—'}</span>
          </>
        )
      },
      { label: 'Email', render: (m) => m.email || '—' },
      { label: 'Order', render: (m) => m.order }
    ]}
    fields={[
      { name: 'name', label: 'Full name', required: true },
      { name: 'designation', label: 'Designation' },
      { name: 'email', label: 'Email' },
      { name: 'linkedin', label: 'LinkedIn URL' },
      { name: 'photo', label: 'Photo URL' },
      { name: 'bio', label: 'Short bio', type: 'textarea' },
      { name: 'order', label: 'Sort order', type: 'number' },
      { name: 'isPublished', label: 'Show on the website', type: 'checkbox' }
    ]}
  />
);

export default TeamManager;
