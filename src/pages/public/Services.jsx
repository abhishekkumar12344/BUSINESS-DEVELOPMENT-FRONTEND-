import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import PageHeader from '../../components/PageHeader';
import Reveal from '../../components/Reveal';
import { services as fallbackServices } from '../../data/siteContent';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState(fallbackServices);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    let alive = true;
    api
      .get('/content/services')
      .then(({ data }) => {
        if (alive && data?.items?.length) setServices(data.items);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  return (
    <div className="services-page">
      <PageHeader
        eyebrow="Our services"
        title="Four service lines that cover planning, running and growing a business."
        intro="Each line can be engaged on its own or combined. The scope is always shaped around the size, complexity and requirements of the work."
      />

      <section className="section services-list">
        <div className="shell">
          {services.map((service, index) => {
            const open = openIndex === index;
            return (
              <Reveal key={service.slug || service._id || service.title} className={`service-row ${open ? 'is-open' : ''}`} delay={index * 60}>
                <button
                  type="button"
                  className="service-row__head"
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  aria-expanded={open}
                  aria-controls={`service-panel-${index}`}
                >
                  <span className="service-row__num">{service.number}</span>
                  <span className="service-row__titles">
                    <h2>{service.title}</h2>
                    <p>{service.summary}</p>
                  </span>
                  <span className="service-row__toggle" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M10 4v12M4 10h12" className="service-row__plus-v" />
                    </svg>
                  </span>
                </button>

                <div id={`service-panel-${index}`} className="service-row__panel" hidden={!open}>
                  <div className="service-row__panel-inner">
                    <p className="service-row__desc">{service.description}</p>
                    <ul className="service-row__points">
                      {(service.points || []).map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <div className="service-row__actions">
                      <Link to={`/services/${service.slug || ''}`} className="btn btn--outline">Service details</Link>
                      <Link to="/consultation" className="btn btn--green">Discuss this service</Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="section section--tint services-note">
        <div className="shell services-note__grid">
          <Reveal>
            <p className="kicker">Scope and flexibility</p>
            <h2>Support that adapts to the size of the work.</h2>
          </Reveal>
          <Reveal delay={100}>
            <p>
              Services can be adapted according to the size, complexity and requirements of each client and project.
              A short coordination engagement and a long running management arrangement follow the same method — only
              the depth changes.
            </p>
            <Link to="/approach" className="text-link">See how we work</Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Services;
