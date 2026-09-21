import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/client';
import PageHeader from '../../components/PageHeader';
import Loader from '../../components/Loader';
import { pageImages } from '../../data/siteContent';
import './InsightDetail.css';

const InsightDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get(`/content/blogs/slug/${slug}`)
      .then(({ data }) => alive && setPost(data?.item || null))
      .catch(() => alive && setPost(null))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [slug]);

  if (loading) return <Loader label="Loading article" />;

  if (!post) {
    return (
      <div className="insight-detail">
        <PageHeader eyebrow="Insights" title="This article is not available." intro="It may have been unpublished or moved." />
        <div className="shell section">
          <Link to="/insights" className="btn btn--green">Back to insights</Link>
        </div>
      </div>
    );
  }

  return (
    <article className="insight-detail">
      <PageHeader
        eyebrow={`${post.category} · ${post.readTime}`}
        title={post.title}
        intro={post.excerpt}
        image={post.coverImage || pageImages.desk}
      />

      <div className="section">
        <div className="shell insight-detail__body">
          {post.coverImage && <img src={post.coverImage} alt="" className="insight-detail__cover" />}
          <p className="insight-detail__byline">
            {post.authorName}
            {post.publishedAt && ` · ${new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`}
          </p>
          <div className="insight-detail__content">
            {(post.content || '').split('\n').filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          {post.tags?.length > 0 && (
            <ul className="insight-detail__tags">
              {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          )}
          <Link to="/insights" className="text-link">All insights</Link>
        </div>
      </div>
    </article>
  );
};

export default InsightDetail;
