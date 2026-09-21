import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/client';
import PageHeader from '../../components/PageHeader';
import Reveal from '../../components/Reveal';
import Loader from '../../components/Loader';
import {
  services as fallbackServices,
  approach,
  pageImages,
} from '../../data/siteContent';
import './ServiceDetail.css';

const ServiceDetail = () => {
  const { slug } = useParams();

  const [service, setService] = useState(
    () =>
      fallbackServices.find((item) => item.slug === slug) ||
      null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    setLoading(true);

    api
      .get(`/content/services/slug/${slug}`)
      .then(({ data }) => {
        if (alive && data?.item) {
          setService(data.item);
        }
      })
      .catch(() => {
        const local = fallbackServices.find(
          (item) => item.slug === slug
        );

        if (alive) {
          setService(local || null);
        }
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, [slug]);

  /* ========================================================
     LOADING
  ======================================================== */

  if (loading && !service) {
    return <Loader label="Loading service" />;
  }

  /* ========================================================
     NOT FOUND
  ======================================================== */

  if (!service) {
    return (
      <div className="service-detail service-detail--not-found">

        <PageHeader
          eyebrow="Service not found"
          title="This service page is not available."
          intro="The service you are looking for may have been renamed or unpublished."
        />

        <div className="shell section service-detail__back">
          <Link
            to="/services"
            className="btn btn--green"
          >
            Back to all services
          </Link>
        </div>

      </div>
    );
  }

  const others = fallbackServices.filter(
    (item) => item.slug !== service.slug
  );

  return (
    <div className="service-detail">

      {/* ====================================================
          PAGE HEADER
      ==================================================== */}

      <PageHeader
        eyebrow={`Service ${service.number || '01'}`}
        title={service.title}
        intro={service.summary}
        image={service.image || pageImages.collaboration}
      />

      {/* ====================================================
          SERVICE HERO
      ==================================================== */}

      <section className="section service-detail__hero">

        <div className="shell">

          <Reveal className="service-detail__hero-grid">

            <div className="service-detail__hero-visual">

              <span className="service-detail__hero-number">
                {service.number || '01'}
              </span>

              <div className="service-detail__hero-pattern">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="service-detail__hero-label">
                <span>
                  Nisha
                </span>

                <span>
                  {service.serviceType || 'Management support'}
                </span>
              </div>

            </div>

            <div className="service-detail__hero-copy">

              <p className="kicker">
                The service
              </p>

              <h2>
                {service.title}
              </h2>

              <p className="service-detail__lead">
                {service.description}
              </p>

              <Link
                to="/consultation"
                className="btn btn--green"
              >
                Discuss this service
                <span>↗</span>
              </Link>

            </div>

          </Reveal>

        </div>

      </section>

      {/* ====================================================
          WHAT THIS COVERS
      ==================================================== */}

      <section className="section service-detail__covers">

        <div className="shell">

          <Reveal className="service-detail__section-head">

            <div>
              <p className="kicker">
                What we cover
              </p>

              <h2>
                Practical support
                <br />
                where it matters.
              </h2>
            </div>

            <p>
              The exact scope is shaped around the requirements
              of the engagement. The areas below describe the
              typical ways this service can support the work.
            </p>

          </Reveal>

          <div className="service-detail__points">

            {(service.points || []).map(
              (point, index) => (
                <Reveal
                  key={point}
                  className="service-detail__point"
                  delay={index * 70}
                >

                  <span className="service-detail__point-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div>
                    <h3>
                      {point}
                    </h3>

                    <span className="service-detail__point-arrow">
                      ↗
                    </span>
                  </div>

                </Reveal>
              )
            )}

          </div>

        </div>

      </section>

      {/* ====================================================
          HOW THE WORK RUNS
      ==================================================== */}

      <section className="section section--forest service-detail__process">

        <div className="shell">

          <Reveal className="service-detail__process-head">

            <p className="kicker">
              How the work runs
            </p>

            <h2>
              A clear method from
              <br />
              first conversation to delivery.
            </h2>

          </Reveal>

          <div className="service-detail__steps">

            {approach.map((step, index) => (
              <Reveal
                key={step.title}
                className="service-detail__step"
                delay={index * 70}
              >

                <div className="service-detail__step-top">

                  <span>
                    {step.number ||
                      String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="service-detail__step-line" />

                </div>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.description}
                </p>

              </Reveal>
            ))}

          </div>

        </div>

      </section>

      {/* ====================================================
          ENGAGEMENT
      ==================================================== */}

      <section className="section service-detail__engagement">

        <div className="shell service-detail__engagement-grid">

          <Reveal>

            <p className="kicker">
              The right level of support
            </p>

            <h2>
              Focused support or
              <br />
              ongoing management.
            </h2>

          </Reveal>

          <Reveal delay={100}>

            <p className="service-detail__engagement-text">
              Services can be adapted according to the size,
              complexity and requirements of each engagement.
              We can support a defined piece of work or work
              alongside your team over a longer period.
            </p>

            <Link
              to="/consultation"
              className="text-link"
            >
              Discuss your requirements
              <span>↗</span>
            </Link>

          </Reveal>

        </div>

      </section>

      {/* ====================================================
          OTHER SERVICES
      ==================================================== */}

      {others.length > 0 && (
        <section className="section service-detail__others">

          <div className="shell">

            <Reveal className="service-detail__others-head">

              <p className="kicker">
                Explore further
              </p>

              <h2>
                Other ways we can help.
              </h2>

            </Reveal>

            <div className="service-detail__other-grid">

              {others.map((other, index) => (
                <Reveal
                  key={other.slug}
                  delay={index * 70}
                >

                  <Link
                    to={`/services/${other.slug}`}
                    className="service-detail__other-card"
                  >

                    <span>
                      {other.number}
                    </span>

                    <div>

                      <h3>
                        {other.title}
                      </h3>

                      <p>
                        {other.summary}
                      </p>

                    </div>

                    <strong>
                      ↗
                    </strong>

                  </Link>

                </Reveal>
              ))}

            </div>

          </div>

        </section>
      )}

      {/* ====================================================
          FINAL CTA
      ==================================================== */}

      <section className="section service-detail__cta">

        <div className="shell">

          <Reveal className="service-detail__cta-inner">

            <div>

              <p className="kicker">
                Start a conversation
              </p>

              <h2>
                Let's discuss what
                <br />
                the work requires.
              </h2>

              <p>
                Share your objective, timeline and current
                requirements. We will discuss the most practical
                way to support the work.
              </p>

            </div>

            <div className="service-detail__cta-actions">

              <Link
                to="/consultation"
                className="btn btn--light"
              >
                Discuss Your Project
                <span>↗</span>
              </Link>

              <Link
                to="/contact"
                className="service-detail__cta-link"
              >
                Contact us
              </Link>

            </div>

          </Reveal>

        </div>

      </section>

    </div>
  );
};

export default ServiceDetail;