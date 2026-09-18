import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import PageHeader from '../../components/PageHeader';
import Reveal from '../../components/Reveal';
import Loader from '../../components/Loader';
import './Insights.css';

const Insights = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');

  useEffect(() => {
    let alive = true;
    api
      .get('/content/blogs')
      .then(({ data }) => alive && setPosts(data?.items || []))
      .catch(() => alive && setPosts([]))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const categories = ['ALL', ...new Set(posts.map((p) => p.category).filter(Boolean))];
  const shown = category === 'ALL' ? posts : posts.filter((p) => p.category === category);
  const [lead, ...rest] = shown;

  return (
    <div className="insights-page">
      <PageHeader
        eyebrow="Insights"
        title="Notes on managing projects, operations and growth."
        intro="Practical writing from our team on planning, coordination and business management."
      />

      <section className="section insights-body">
        <div className="shell">
          {loading && <Loader label="Loading insights" />}

          {!loading && posts.length === 0 && (
            <Reveal className="insights-empty">
              <h2>The first articles are on the way.</h2>
              <p>
                We are preparing practical notes on project planning, business coordination and management reporting.
                Published pieces will appear here.
              </p>
              <Link to="/contact" className="btn btn--outline">Ask us a question instead</Link>
            </Reveal>
          )}

          {!loading && posts.length > 0 && (
            <>
              {categories.length > 2 && (
                <div className="insights-filter">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`insights-filter__btn ${category === cat ? 'is-active' : ''}`}
                      onClick={() => setCategory(cat)}
                    >
                      {cat === 'ALL' ? 'All topics' : cat}
                    </button>
                  ))}
                </div>
              )}

              {lead && (
                <Reveal className="insights-lead">
                  {lead.coverImage && <img src={lead.coverImage} alt="" className="insights-lead__img" />}
                  <div className="insights-lead__body">
                    <p className="insights-meta">
                      {lead.category} · {lead.readTime}
                    </p>
                    <h2>{lead.title}</h2>
                    <p className="insights-lead__excerpt">{lead.excerpt}</p>
                    <Link to={`/insights/${lead.slug}`} className="btn btn--green">Read the article</Link>
                  </div>
                </Reveal>
              )}

              {rest.length > 0 && (
                <div className="insights-grid">
                  {rest.map((post, i) => (
                    <Reveal key={post._id} delay={i * 70}>
                      <Link to={`/insights/${post.slug}`} className="insight-card">
                        {post.coverImage && <img src={post.coverImage} alt="" className="insight-card__img" />}
                        <div className="insight-card__body">
                          <p className="insights-meta">{post.category} · {post.readTime}</p>
                          <h3>{post.title}</h3>
                          <p>{post.excerpt}</p>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Insights;
