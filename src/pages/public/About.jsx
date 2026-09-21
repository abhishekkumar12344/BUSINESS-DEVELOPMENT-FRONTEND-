import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Reveal from '../../components/Reveal';
import ValueIcon from '../../components/ValueIcon';
import { useSite } from '../../context/SiteContext';
import { company, values } from '../../data/siteContent';
import './About.css';

const About = () => {
  const { settings } = useSite();

  const aboutImage =
    settings.aboutImage ||
    company.aboutImage ||
    settings.logo;

  return (
    <main className="about">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <PageHeader
        eyebrow="About the company"
        title="Structured management support, built around how businesses actually run."
        intro={company.intro}
        image={aboutImage}
      />


      {/* =====================================================
          COMPANY STORY
      ===================================================== */}

      <section className="section about-story">

        <div className="shell about-story__grid">

          <Reveal className="about-story__content">

            <div className="about-story__label">
              <span>01</span>
              <span>Our story</span>
            </div>

            <h2>
              Bringing structure to
              <em>the work behind success.</em>
            </h2>

            <p className="about-story__lead">
              {company.intro2}
            </p>

            <p>
              {company.intro3}
            </p>

            <Link
              to="/services"
              className="text-link"
            >
              Explore what we manage
              <span>↗</span>
            </Link>

          </Reveal>


          <Reveal
            className="about-story__visual"
            delay={120}
          >

            <div className="about-story__image-wrap">

              <img
                src={aboutImage}
                alt={`${company.name} company`}
                className="about-story__image"
              />

              <div className="about-story__image-overlay" />

              <div className="about-story__image-caption">
                <span>{company.name}</span>
                <span>Management & Coordination</span>
              </div>

            </div>

          </Reveal>

        </div>

      </section>


      {/* =====================================================
          COMPANY AT A GLANCE
      ===================================================== */}

      <section className="about-facts">

        <div className="shell">

          <Reveal className="about-facts__heading">

            <p className="kicker">At a glance</p>

            <h2>
              A practical foundation
              <em>for organised work.</em>
            </h2>

          </Reveal>


          <div className="about-facts__grid">

            <div className="about-fact">

              <span className="about-fact__number">
                01
              </span>

              <span className="about-fact__label">
                Registered name
              </span>

              <strong>
                {company.name}
              </strong>

            </div>


            <div className="about-fact">

              <span className="about-fact__number">
                02
              </span>

              <span className="about-fact__label">
                Based in
              </span>

              <strong>
                {company.location}
              </strong>

            </div>


            <div className="about-fact">

              <span className="about-fact__number">
                03
              </span>

              <span className="about-fact__label">
                Core focus
              </span>

              <strong>
                Project management, business management & strategic support
              </strong>

            </div>


            <div className="about-fact">

              <span className="about-fact__number">
                04
              </span>

              <span className="about-fact__label">
                Client reach
              </span>

              <strong>
                Local, national & international clients and partners
              </strong>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          VISION / MISSION
      ===================================================== */}

      <section className="section section--forest about-vm">

        <div className="shell">

          <Reveal className="about-vm__heading">

            <p className="kicker">
              Direction & purpose
            </p>

            <h2>
              What guides
              <em>the company forward.</em>
            </h2>

          </Reveal>


          <div className="about-vm__grid">

            <Reveal
              className="vm-card"
            >

              <div className="vm-card__top">
                <span>01</span>
                <span>VISION</span>
              </div>

              <h3>
                {company.vision.statement}
              </h3>

              <div className="vm-card__line" />

              <p>
                {company.vision.support}
              </p>

            </Reveal>


            <Reveal
              className="vm-card vm-card--accent"
              delay={120}
            >

              <div className="vm-card__top">
                <span>02</span>
                <span>MISSION</span>
              </div>

              <h3>
                {company.mission.statement}
              </h3>

              <div className="vm-card__line" />

              <p>
                {company.mission.support}
              </p>

            </Reveal>

          </div>

        </div>

      </section>


      {/* =====================================================
          VALUES
      ===================================================== */}

      <section className="section about-values">

        <div className="shell">

          <Reveal className="about-values__heading">

            <div>

              <p className="kicker">
                Our values
              </p>

              <h2>
                Principles that shape
                <em>every engagement.</em>
              </h2>

            </div>

            <p>
              Our values influence how we communicate, plan,
              coordinate and deliver work with clients and partners.
            </p>

          </Reveal>


          <div className="about-values__grid">

            {values.map((value, i) => (

              <Reveal
                key={value.title}
                className="about-value"
                delay={i * 60}
              >

                <div className="about-value__top">

                  <span className="about-value__number">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span className="about-value__icon">
                    <ValueIcon
                      name={value.icon}
                      size={25}
                    />
                  </span>

                </div>

                <div className="about-value__content">

                  <h3>
                    {value.title}
                  </h3>

                  <p>
                    {value.description}
                  </p>

                </div>

                <span className="about-value__arrow">
                  ↗
                </span>

              </Reveal>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          COMMITMENT
      ===================================================== */}

      <section className="section section--forest about-commitment">

        <div className="shell about-commitment__grid">

          <Reveal className="about-commitment__intro">

            <p className="kicker">
              Our commitment
            </p>

            <h2>
              We commit to a way of working,
              <em>not empty promises.</em>
            </h2>

            <p>
              Every engagement is approached with clear
              expectations, communication and accountability.
            </p>

          </Reveal>


          <Reveal
            className="about-commitment__content"
            delay={120}
          >

            <div className="about-commitment__title">
              <span>Our standards</span>
              <span>01 — 07</span>
            </div>

            <ol className="about-commitment__list">

              {company.commitment.map((item, i) => (

                <li key={item}>

                  <span>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <strong>
                    {item}
                  </strong>

                </li>

              ))}

            </ol>

          </Reveal>

        </div>

      </section>


      {/* =====================================================
          LOOKING AHEAD
      ===================================================== */}

      <section className="section about-ahead">

        <div className="shell about-ahead__inner">

          <Reveal>

            <p className="kicker">
              Looking ahead
            </p>

            <h2>
              Building toward
              <em>the next stage.</em>
            </h2>

            <p className="about-ahead__text">
              {company.lookingAhead}
            </p>

            <div className="about-ahead__actions">

              <Link
                to="/consultation"
                className="btn btn--green"
              >
                Discuss Your Project
                <span>↗</span>
              </Link>

              <Link
                to="/services"
                className="btn btn--outline"
              >
                Explore Our Services
                <span>↗</span>
              </Link>

            </div>

          </Reveal>

        </div>

      </section>

    </main>
  );
};

export default About;