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
        if (alive && data?.items?.length) {
          setServices(data.items);
        }
      })
      .catch(() => {})
      .finally(() => {});

    return () => {
      alive = false;
    };
  }, []);

  const featured = services[0];
  const secondaryServices = services.slice(1);

  return (
    <div className="services-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <PageHeader
        eyebrow="Our services"
        title="Management support designed around the work that matters."
        intro="From planning and coordination to business management and growth, we bring structure to complex work and clarity to the decisions behind it."
      />

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="section services-intro">
        <div className="shell services-intro__grid">

          <Reveal className="services-intro__statement">
            <p className="kicker">What we do</p>

            <h2>
              We help businesses move
              <span> from intention to execution.</span>
            </h2>
          </Reveal>

          <Reveal
            className="services-intro__copy"
            delay={100}
          >
            <p>
              Good ideas need structure behind them. Our services are
              designed to bring planning, coordination and management
              into one clear working framework.
            </p>

            <p>
              Whether the requirement is focused support or a longer
              management engagement, the approach is adapted to the
              needs of the work.
            </p>
          </Reveal>

        </div>
      </section>

      {/* =====================================================
          FEATURED SERVICE
      ===================================================== */}

      {featured && (
        <section className="section services-featured-section">
          <div className="shell">

            <Reveal className="services-featured">

              <div className="services-featured__visual">

                <div className="services-featured__number">
                  {featured.number || '01'}
                </div>

                <div className="services-featured__visual-content">

                  <span className="services-featured__label">
                    Core service
                  </span>

                  <div className="services-featured__symbol">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                </div>

              </div>

              <div className="services-featured__content">

                <p className="kicker">
                  {featured.serviceType || 'Service'}
                </p>

                <h2>
                  {featured.title}
                </h2>

                <p className="services-featured__summary">
                  {featured.summary}
                </p>

                <div className="services-featured__divider" />

                <p className="services-featured__description">
                  {featured.description}
                </p>

                {featured.points?.length > 0 && (
                  <ul className="services-featured__points">
                    {featured.points.map((point) => (
                      <li key={point}>
                        <span>+</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="services-featured__actions">

                  <Link
                    to={`/services/${featured.slug || ''}`}
                    className="btn btn--green"
                  >
                    Explore this service
                    <span>↗</span>
                  </Link>

                  <Link
                    to="/consultation"
                    className="text-link"
                  >
                    Discuss your requirements
                  </Link>

                </div>

              </div>

            </Reveal>

          </div>
        </section>
      )}

      {/* =====================================================
          OTHER SERVICES
      ===================================================== */}

      {secondaryServices.length > 0 && (
        <section className="section services-list">

          <div className="shell">

            <Reveal className="services-list__head">

              <div>
                <p className="kicker">
                  Our capabilities
                </p>

                <h2>
                  Four ways we can support the work.
                </h2>
              </div>

              <p>
                Each service can stand alone or form part of a
                broader management engagement.
              </p>

            </Reveal>

            <div className="services-list__items">

              {secondaryServices.map((service, index) => {

                const actualIndex = index + 1;
                const open = openIndex === actualIndex;

                return (
                  <Reveal
                    key={
                      service.slug ||
                      service._id ||
                      service.title
                    }
                    className={`service-row ${
                      open ? 'is-open' : ''
                    }`}
                    delay={index * 70}
                  >

                    <button
                      type="button"
                      className="service-row__head"
                      onClick={() =>
                        setOpenIndex(
                          open ? -1 : actualIndex
                        )
                      }
                      aria-expanded={open}
                      aria-controls={`service-panel-${actualIndex}`}
                    >

                      <span className="service-row__num">
                        {service.number ||
                          String(actualIndex + 1).padStart(
                            2,
                            '0'
                          )}
                      </span>

                      <span className="service-row__titles">

                        <h3>
                          {service.title}
                        </h3>

                        <p>
                          {service.summary}
                        </p>

                      </span>

                      <span
                        className="service-row__toggle"
                        aria-hidden="true"
                      >
                        <span></span>
                        <span></span>
                      </span>

                    </button>

                    <div
                      id={`service-panel-${actualIndex}`}
                      className="service-row__panel"
                      hidden={!open}
                    >

                      <div className="service-row__panel-inner">

                        <div className="service-row__description">
                          <p>
                            {service.description}
                          </p>
                        </div>

                        {service.points?.length > 0 && (
                          <ul className="service-row__points">

                            {service.points.map(
                              (point) => (
                                <li key={point}>
                                  <span>+</span>
                                  {point}
                                </li>
                              )
                            )}

                          </ul>
                        )}

                        <div className="service-row__actions">

                          <Link
                            to={`/services/${
                              service.slug || ''
                            }`}
                            className="text-link"
                          >
                            Service details
                            <span>↗</span>
                          </Link>

                          <Link
                            to="/consultation"
                            className="text-link"
                          >
                            Discuss this service
                            <span>↗</span>
                          </Link>

                        </div>

                      </div>

                    </div>

                  </Reveal>
                );
              })}

            </div>

          </div>

        </section>
      )}

      {/* =====================================================
          ENGAGEMENT MODEL
      ===================================================== */}

      <section className="section section--tint services-method">

        <div className="shell">

          <Reveal className="services-method__head">

            <p className="kicker">
              How we engage
            </p>

            <h2>
              The scope changes.
              <br />
              The method stays clear.
            </h2>

          </Reveal>

          <div className="services-method__grid">

            <Reveal
              className="services-method__item"
              delay={50}
            >
              <span>01</span>

              <h3>
                Understand
              </h3>

              <p>
                We first understand the objective, current
                situation, people involved and constraints.
              </p>
            </Reveal>

            <Reveal
              className="services-method__item"
              delay={100}
            >
              <span>02</span>

              <h3>
                Structure
              </h3>

              <p>
                Priorities, responsibilities, timelines and
                deliverables are translated into a practical plan.
              </p>
            </Reveal>

            <Reveal
              className="services-method__item"
              delay={150}
            >
              <span>03</span>

              <h3>
                Coordinate
              </h3>

              <p>
                We keep people, information and actions moving
                together throughout the engagement.
              </p>
            </Reveal>

            <Reveal
              className="services-method__item"
              delay={200}
            >
              <span>04</span>

              <h3>
                Deliver
              </h3>

              <p>
                Progress is reviewed against the agreed objective
                so the work stays focused and accountable.
              </p>
            </Reveal>

          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="section services-cta">

        <div className="shell">

          <Reveal className="services-cta__inner">

            <div>

              <p className="kicker">
                Let's discuss the work
              </p>

              <h2>
                Not sure which service
                <br />
                fits your requirement?
              </h2>

              <p>
                Tell us what you are trying to achieve.
                We can discuss the requirement and identify
                the right level of support.
              </p>

            </div>

            <Link
              to="/consultation"
              className="btn btn--light"
            >
              Start a Conversation
              <span>↗</span>
            </Link>

          </Reveal>

        </div>

      </section>

    </div>
  );
};

export default Services;