import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import Reveal from '../../components/Reveal';
import GrowthArc from '../../components/GrowthArc';
import ValueIcon from '../../components/ValueIcon';
import { useSite } from '../../context/SiteContext';

import {
  company,
  services as fallbackServices,
  approach as fallbackApproach,
  values as fallbackValues,
  founder as fallbackFounder,
  whyNisha,
  audiences
} from '../../data/siteContent';

import './Home.css';

const helpWith = [
  {
    number: '01',
    label: 'Projects',
    title: 'Projects that need a plan',
    text: 'An idea exists, but the sequence, resources and timeline have not been clearly defined.'
  },
  {
    number: '02',
    label: 'Operations',
    title: 'Operations that need structure',
    text: 'Work happens, but processes, documentation and ownership need stronger coordination.'
  },
  {
    number: '03',
    label: 'Growth',
    title: 'Growth that needs direction',
    text: 'Opportunities are visible, but the next step needs planning, analysis and execution.'
  },
  {
    number: '04',
    label: 'Teams',
    title: 'Teams that need coordination',
    text: 'Several people, vendors or partners are involved and communication needs structure.'
  }
];

const Home = () => {
  const { settings } = useSite();

  const [services, setServices] = useState(fallbackServices);
  const [approach, setApproach] = useState(fallbackApproach);
  const [values, setValues] = useState(fallbackValues);
  const [founder, setFounder] = useState(fallbackFounder);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const [s, a, v, t] = await Promise.all([
          api.get('/content/services'),
          api.get('/content/approach'),
          api.get('/content/values'),
          api.get('/content/team')
        ]);

        if (!alive) return;

        if (s.data?.items?.length) {
          setServices(s.data.items);
        }

        if (a.data?.items?.length) {
          setApproach(a.data.items);
        }

        if (v.data?.items?.length) {
          setValues(v.data.items);
        }

        const featuredFounder = (t.data?.items || []).find((member) => member.isFounder);
        if (featuredFounder) {
          setFounder({
            name: featuredFounder.name,
            designation: featuredFounder.designation || fallbackFounder.designation,
            photo: featuredFounder.photo || fallbackFounder.photo,
            bio: featuredFounder.bio || fallbackFounder.bio,
            quote: fallbackFounder.quote
          });
        }
      } catch {
        // Fallback company-profile content remains active.
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, []);

  const hero = settings.homepage || {};

  const commitmentPoints =
    settings.homepage?.commitmentPoints?.length
      ? settings.homepage.commitmentPoints
      : company.commitment;

  const activeApproach = approach[activeStep];

  return (
    <main className="home">

      {/* =========================================================
          HERO
      ========================================================= */}
     <section
  className="hero hero--image"
  style={{
    '--hero-image': `url("${settings.heroImage || company.heroImage}")`
  }}
>
  <div className="hero__overlay" />

  <GrowthArc className="hero__motif" />

  <div className="shell hero__inner">

    <Reveal className="hero__copy">

      <div className="hero__eyebrow">
        <span className="hero__eyebrow-line" />
        {company.descriptor}
      </div>

      <h1 className="hero__title">
        We turn complex work
        <span>into organised action.</span>
      </h1>

      <p className="hero__sub">
        {hero.heroSubtitle ||
          company.heroSubtitle ||
          'Professional management, coordination and business support for projects that need clarity, structure and disciplined execution.'}
      </p>

      <div className="hero__actions">

        <Link
          to="/consultation"
          className="btn btn--gold"
        >
          Discuss Your Project
          <span>↗</span>
        </Link>

        <Link
          to="/services"
          className="btn btn--hero-ghost"
        >
          Explore Services
          <span>↗</span>
        </Link>

      </div>

      <div className="hero__meta">

        <span className="hero__location-dot" />

        <span>
          Based in {settings.contact?.address || company.location}
        </span>

      </div>

    </Reveal>

  </div>

  <div className="hero__bottom">

    <span>Plan</span>
    <i />

    <span>Organize</span>
    <i />

    <span>Execute</span>
    <i />

    <span>Monitor</span>
    <i />

    <span>Deliver</span>

  </div>

</section>


      {/* =========================================================
          TRUST / NUMBERS
      ========================================================= */}
      <section className="home-stats">
        <div className="shell home-stats__grid">

          <div className="home-stat">
            <span className="home-stat__number">01</span>
            <div>
              <strong>Clear Planning</strong>
              <span>Defined objectives and direction</span>
            </div>
          </div>

          <div className="home-stat">
            <span className="home-stat__number">02</span>
            <div>
              <strong>Structured Execution</strong>
              <span>Processes built around delivery</span>
            </div>
          </div>

          <div className="home-stat">
            <span className="home-stat__number">03</span>
            <div>
              <strong>Active Coordination</strong>
              <span>People, partners and priorities aligned</span>
            </div>
          </div>

          <div className="home-stat">
            <span className="home-stat__number">04</span>
            <div>
              <strong>Continuous Monitoring</strong>
              <span>Progress tracked from start to finish</span>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================
          ABOUT
      ========================================================= */}
      <section className="section home-about">
        <div className="shell home-about__grid">

          <Reveal className="home-about__heading">

            <p className="kicker">About Nisha</p>

            <h2>
              Management that brings
              <em>clarity to complexity.</em>
            </h2>

            <div className="home-about__index">
              <span>01</span>
              <span>Company</span>
            </div>

          </Reveal>

          <Reveal className="home-about__content" delay={120}>

            <p className="home-about__lead">
              {company.intro}
            </p>

            <div className="home-about__body">
              <p>{company.intro2}</p>
              <p>{company.intro3}</p>
            </div>

            <Link to="/about" className="text-link">
              Read the full company story
              <span>↗</span>
            </Link>

          </Reveal>

        </div>
      </section>


      {/* =========================================================
          FOUNDER
      ========================================================= */}
      <section className="section home-founder">
        <div className="shell home-founder__grid">

          <Reveal className="home-founder__portrait">
            <div className="home-founder__frame">
              <img src={founder.photo} alt={founder.name} loading="lazy" />
            </div>
          </Reveal>

          <Reveal className="home-founder__content" delay={120}>

            <p className="kicker">Founder</p>

            <blockquote className="home-founder__quote">
              &ldquo;{founder.quote}&rdquo;
            </blockquote>

            <p className="home-founder__bio">{founder.bio}</p>

            <div className="home-founder__byline">
              <span className="home-founder__name">{founder.name}</span>
              <span className="home-founder__role">{founder.designation}</span>
            </div>

            <Link to="/team" className="text-link">
              Meet the full team
              <span>↗</span>
            </Link>

          </Reveal>

        </div>
      </section>


      {/* =========================================================
          WHAT WE HELP WITH
      ========================================================= */}
      <section className="section section--cream home-help">

        <div className="shell">

          <Reveal className="section-heading section-heading--split">

            <div>
              <p className="kicker">What we help with</p>
              <h2>
                When the work is important,
                structure matters.
              </h2>
            </div>

            <p>
              We provide practical management support where planning,
              coordination and execution need to work together.
            </p>

          </Reveal>

          <div className="home-help__list">

            {helpWith.map((item, i) => (

              <Reveal
                key={item.number}
                className="home-help__item"
                delay={i * 70}
              >

                <div className="home-help__number">
                  {item.number}
                </div>

                <div className="home-help__main">
                  <span>{item.label}</span>
                  <h3>{item.title}</h3>
                </div>

                <p>{item.text}</p>

                <span className="home-help__arrow">↗</span>

              </Reveal>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          SERVICES
      ========================================================= */}
      <section className="section home-services">

        <div className="shell">

          <Reveal className="section-heading section-heading--services">

            <div>
              <p className="kicker">Our core services</p>

              <h2>
                Four service lines.
                <em>One management discipline.</em>
              </h2>
            </div>

            <Link to="/services" className="btn btn--outline">
              View All Services
              <span>↗</span>
            </Link>

          </Reveal>


          <div className="home-services__grid">

            {services.map((service, i) => (

              <Reveal
                key={service.slug || service._id || service.title}
                className="service-card"
                delay={i * 80}
              >

                <Link
                  to={`/services/${service.slug || ''}`}
                  className="service-card__link"
                >

                  <div className="service-card__top">

                    <span className="service-card__number">
                      {service.number || `0${i + 1}`}
                    </span>

                    <span className="service-card__arrow">
                      ↗
                    </span>

                  </div>

                  <div className="service-card__content">

                    <h3>{service.title}</h3>

                    <p>{service.summary}</p>

                  </div>

                  <div className="service-card__line" />

                  <span className="service-card__explore">
                    Explore service
                  </span>

                </Link>

              </Reveal>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          APPROACH
      ========================================================= */}
      <section className="section section--forest home-approach">

        <div className="shell">

          <Reveal className="home-approach__heading">

            <p className="kicker">Our approach</p>

            <h2>
              A disciplined method
              <em>from idea to delivery.</em>
            </h2>

            <p>
              Successful projects and businesses require clear planning,
              effective communication, disciplined execution and continuous
              monitoring.
            </p>

          </Reveal>


          <div className="home-approach__panel">

            <div
              className="home-approach__rail"
              role="tablist"
              aria-label="Our five step approach"
            >

              {approach.map((step, i) => (

                <button
                  key={step.title}
                  type="button"
                  role="tab"
                  aria-selected={activeStep === i}
                  className={`approach-tab ${
                    activeStep === i ? 'is-active' : ''
                  }`}
                  onClick={() => setActiveStep(i)}
                >

                  <span className="approach-tab__number">
                    {step.number || `0${i + 1}`}
                  </span>

                  <span className="approach-tab__title">
                    {step.title}
                  </span>

                  <span className="approach-tab__arrow">
                    ↗
                  </span>

                </button>

              ))}

            </div>


            <div className="approach-detail">

              <div className="approach-detail__background-number">
                {activeApproach?.number || `0${activeStep + 1}`}
              </div>

              <div className="approach-detail__top">
                <span>STEP</span>
                <span>
                  {String(activeStep + 1).padStart(2, '0')} /{' '}
                  {String(approach.length).padStart(2, '0')}
                </span>
              </div>

              <h3>
                {activeApproach?.title}
              </h3>

              <p className="approach-detail__desc">
                {activeApproach?.description}
              </p>

              <p className="approach-detail__more">
                {activeApproach?.detail}
              </p>

              <Link
                to="/approach"
                className="btn btn--gold"
              >
                See the Full Method
                <span>↗</span>
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          WHY NISHA
      ========================================================= */}
      <section className="section home-why">

        <div className="shell">

          <Reveal className="section-heading">

            <p className="kicker">Why work with us</p>

            <h2>
              The standards behind
              <em>the way we work.</em>
            </h2>

          </Reveal>


          <div className="home-why__grid">

            {whyNisha.map((item, i) => (

              <Reveal
                key={item.number}
                className="why-card"
                delay={i * 60}
              >

                <div className="why-card__top">
                  <span>{item.number}</span>
                  <span>↗</span>
                </div>

                <h3>{item.title}</h3>

                <p>{item.description}</p>

              </Reveal>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          VALUES
      ========================================================= */}
      <section className="section section--cream home-values">

        <div className="shell">

          <Reveal className="section-heading section-heading--center">

            <p className="kicker">Our values</p>

            <h2>
              What we hold
              <em>ourselves to.</em>
            </h2>

          </Reveal>


          <div className="home-values__grid">

            {values.map((value, i) => (

              <Reveal
                key={value.title}
                className="value-card"
                delay={i * 70}
              >

                <div className="value-card__icon">
                  <ValueIcon name={value.icon} />
                </div>

                <span className="value-card__number">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <h3>{value.title}</h3>

                <p>{value.description}</p>

              </Reveal>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          INDUSTRIES / AUDIENCE
      ========================================================= */}
      <section className="section home-audience">

        <div className="shell home-audience__grid">

          <Reveal className="home-audience__intro">

            <p className="kicker">Business opportunities</p>

            <h2>
              Built to support
              <em>different business environments.</em>
            </h2>

            <p>
              Our management and coordination capabilities can be adapted
              to different business environments and project requirements.
              We are open to working with local, national and international
              clients and business partners.
            </p>

            <Link
              to="/industries"
              className="btn btn--outline"
            >
              Explore Opportunities
              <span>↗</span>
            </Link>

          </Reveal>


          <div className="home-audience__list">

            {audiences.map((item, i) => (

              <Reveal
                key={item.title}
                className="audience-item"
                delay={i * 70}
              >

                <span>
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <span className="audience-item__arrow">
                  ↗
                </span>

              </Reveal>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          COMMITMENT
      ========================================================= */}
      <section className="section section--forest home-commitment">

        <div className="shell home-commitment__grid">

          <Reveal className="home-commitment__intro">

            <p className="kicker">Our commitment</p>

            <h2>
              Professional management
              <em>held to clear standards.</em>
            </h2>

            <p>
              We approach every engagement with accountability,
              communication and disciplined execution.
            </p>

          </Reveal>


          <Reveal
            className="home-commitment__list-wrap"
            delay={120}
          >

            <ul className="home-commitment__list">

              {commitmentPoints.map((point, i) => (

                <li key={point}>

                  <span>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <strong>{point}</strong>

                </li>

              ))}

            </ul>

          </Reveal>

        </div>

      </section>


      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="home-cta">

        <div className="home-cta__background">
          <GrowthArc />
        </div>

        <div className="shell home-cta__inner">

          <Reveal>

            <p className="kicker">
              Start a conversation
            </p>

            <h2>
              Have work that needs
              <em>direction?</em>
            </h2>

            <p className="home-cta__description">
              Share your objective, timeline and requirements.
              We will come back with a practical view of how the work
              can be planned, organised and delivered.
            </p>

            <div className="home-cta__actions">

              <Link
                to="/consultation"
                className="btn btn--gold"
              >
                Discuss Your Project
                <span>↗</span>
              </Link>

              <Link
                to="/contact"
                className="btn btn--outline"
              >
                Send an Enquiry
                <span>↗</span>
              </Link>

            </div>

          </Reveal>

        </div>

      </section>

    </main>
  );
};

export default Home;