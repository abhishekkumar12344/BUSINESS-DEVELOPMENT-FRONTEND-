import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/client';
import PageHeader from '../../components/PageHeader';
import Reveal from '../../components/Reveal';
import Loader from '../../components/Loader';
import { services as fallbackServices, approach } from '../../data/siteContent';
import './ServiceDetail.css';

const ServiceDetail = () => {
  const { slug } = useParams();
  const [service, setService] = useState(() => fallbackServices.find((s) => s.slug === slug) || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get(`/content/services/slug/${slug}`)
      .then(({ data }) => {
        if (alive && data?.item) setService(data.item);
      })
      .catch(() => {
        const local = fallbackServices.find((s) => s.slug === slug);
        if (alive) setService(local || null);
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [slug]);

  if (loading && !service) return <Loader label="Loading service" />;

  if (!service) {
    return (
      <div className="service-detail">
        <PageHeader
          eyebrow="Service not found"
          title="This service page is not available."
          intro="The service you are looking for may have been renamed or unpublished."
        />
        <div className="shell section">
          <Link to="/services" className="btn btn--green">Back to all services</Link>
        </div>
      </div>
    );
  }

  const others = fallbackServices.filter((s) => s.slug !== service.slug);

  return (
    <div className="service-detail">
      <PageHeader eyebrow={`Service ${service.number}`} title={service.title} intro={service.summary} />

      <section className="section service-detail__main">
        <div className="shell service-detail__grid">
          <Reveal className="service-detail__copy">
            <p className="service-detail__lead">{service.description}</p>

            <h2>What this covers</h2>
            <ul className="service-detail__points">
              {(service.points || []).map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            <h2>How the work runs</h2>
            <ol className="service-detail__steps">
              {approach.map((step) => (
                <li key={step.title}>
                  <span>{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="service-detail__aside" delay={120}>
            <div className="service-detail__card">
              <h3>Start with this service</h3>
              <p>Tell us the objective, the timeline and who is involved. We will suggest a practical way to run it.</p>
              <Link to="/consultation" className="btn btn--gold">Discuss Your Project</Link>
              <Link to="/contact" className="text-link service-detail__card-link">Or send an enquiry</Link>
            </div>

            <div className="service-detail__others">
              <h3>Other services</h3>
              {others.map((other) => (
                <Link key={other.slug} to={`/services/${other.slug}`} className="service-detail__other">
                  <span>{other.number}</span>
                  {other.title}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
