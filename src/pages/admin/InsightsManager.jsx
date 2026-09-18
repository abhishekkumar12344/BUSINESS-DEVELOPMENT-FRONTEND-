import ResourceManager from '../../components/ResourceManager';

const CATEGORIES = [
  'Management Insights',
  'Project Management',
  'Business Management',
  'Strategy',
  'Company News'
];

const InsightsManager = () => (
  <ResourceManager
    title="Insights"
    description="Articles published under insights. Drafts stay hidden until you publish them."
    path="blogs"
    singular="Article"
    searchKeys={['title', 'category', 'excerpt']}
    emptyTitle="No articles yet"
    emptyText="Write the first article to start the insights section."
    columns={[
      {
        label: 'Article',
        render: (b) => (
          <>
            <span className="admin-table__strong">{b.title}</span>
            <span className="admin-table__sub">{b.category} · {b.readTime}</span>
          </>
        )
      },
      { label: 'Author', render: (b) => b.authorName || '—' },
      { label: 'Views', render: (b) => b.views ?? 0 },
      {
        label: 'Published',
        render: (b) => (b.publishedAt ? new Date(b.publishedAt).toLocaleDateString('en-IN') : '—')
      }
    ]}
    fields={[
      { name: 'title', label: 'Headline', required: true },
      { name: 'category', label: 'Category', type: 'select', options: CATEGORIES, initial: 'Management Insights' },
      { name: 'authorName', label: 'Author name', initial: 'Nisha Editorial Desk' },
      { name: 'readTime', label: 'Read time', initial: '4 min read' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2, hint: 'Shown on the insights list.' },
      { name: 'content', label: 'Article body', type: 'textarea', rows: 12, hint: 'Leave a blank line between paragraphs.' },
      { name: 'tags', label: 'Tags', type: 'list', hint: 'One tag per line.' },
      { name: 'coverImage', label: 'Cover image URL' },
      { name: 'seoTitle', label: 'SEO title' },
      { name: 'seoDescription', label: 'SEO description', type: 'textarea', rows: 2 },
      { name: 'isPublished', label: 'Publish this article', type: 'checkbox' }
    ]}
  />
);

export default InsightsManager;
