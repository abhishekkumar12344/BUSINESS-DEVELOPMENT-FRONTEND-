import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import PageHeader from '../../components/PageHeader';
import Reveal from '../../components/Reveal';
import Loader from '../../components/Loader';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    let alive = true;

    api
      .get('/content/projects')
      .then(({ data }) => {
        if (alive) {
          setProjects(data?.items || []);
        }
      })
      .catch(() => {
        if (alive) setProjects([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const sectors = [
    'ALL',
    ...new Set(
      projects
        .map((project) => project.sector)
        .filter(Boolean)
    ),
  ];

  const shown =
    filter === 'ALL'
      ? projects
      : projects.filter((project) => project.sector === filter);

  const featuredProject = shown[0];
  const remainingProjects = shown.slice(1);

  return (
    <div className="projects-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <PageHeader
        eyebrow="Projects & case studies"
        title="Turning complex work into clear, coordinated progress."
        intro="A selection of projects and engagements published by our team with the client's agreement."
      />

      {/* =====================================================
          INTRO / PROJECT STATS
      ===================================================== */}

      {!loading && projects.length > 0 && (
        <section className="section projects-intro">
          <div className="shell projects-intro__grid">

            <Reveal className="projects-intro__copy">
              <p className="kicker">Our work</p>

              <h2>
                Practical management.
                <br />
                Measurable progress.
              </h2>

              <p>
                Every project begins with a clear understanding of the
                objective, the people involved and the work required to
                move forward.
              </p>

              <p>
                Explore the engagements below to understand the context,
                approach and outcomes behind our work.
              </p>
            </Reveal>

            <Reveal
              className="projects-intro__stats"
              delay={100}
            >
              <div className="project-stat">
                <strong>{projects.length}</strong>
                <span>Published projects</span>
              </div>

              <div className="project-stat">
                <strong>{sectors.length - 1}</strong>
                <span>Business sectors</span>
              </div>

              <div className="project-stat">
                <strong>01</strong>
                <span>Structured approach</span>
              </div>
            </Reveal>

          </div>
        </section>
      )}

      {/* =====================================================
          PROJECT CONTENT
      ===================================================== */}

      <section className="section projects-body">
        <div className="shell">

          {loading && (
            <Loader label="Loading projects" />
          )}

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {!loading && projects.length === 0 && (
            <Reveal className="projects-empty">

              <div className="projects-empty__number">
                01
              </div>

              <span
                className="projects-empty__mark"
                aria-hidden="true"
              >
                <svg
                  width="52"
                  height="52"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                >
                  <rect
                    x="4"
                    y="8"
                    width="24"
                    height="18"
                    rx="2"
                  />

                  <path d="M11 8V6h10v2M4 16h24M16 16v4" />
                </svg>
              </span>

              <p className="kicker">
                Portfolio in progress
              </p>

              <h2>
                Our published case studies
                <br />
                are being prepared.
              </h2>

              <p className="projects-empty__description">
                We publish project records only with client agreement
                and once the relevant work has reached an appropriate
                stage of completion.
              </p>

              <p className="projects-empty__note">
                If you would like to discuss a specific type of
                project or request relevant references, speak with
                our team directly.
              </p>

              <div className="projects-empty__actions">
                <Link
                  to="/consultation"
                  className="btn btn--green"
                >
                  Discuss Your Project
                </Link>

                <Link
                  to="/services"
                  className="btn btn--outline"
                >
                  Explore Services
                </Link>
              </div>

            </Reveal>
          )}

          {/* =================================================
              PROJECTS
          ================================================= */}

          {!loading && projects.length > 0 && (
            <>

              {/* FILTER */}
              {sectors.length > 2 && (
                <Reveal className="projects-filter-wrap">

                  <div className="projects-filter__label">
                    Filter by sector
                  </div>

                  <div className="projects-filter">
                    {sectors.map((sector) => (
                      <button
                        key={sector}
                        type="button"
                        className={`projects-filter__btn ${
                          filter === sector
                            ? 'is-active'
                            : ''
                        }`}
                        onClick={() => setFilter(sector)}
                      >
                        {sector === 'ALL'
                          ? 'All projects'
                          : sector}
                      </button>
                    ))}
                  </div>

                </Reveal>
              )}

              {/* =================================================
                  FEATURED PROJECT
              ================================================= */}

              {featuredProject && (
                <Reveal className="project-featured">

                  <div className="project-featured__image">

                    {featuredProject.coverImage ? (
                      <img
                        src={featuredProject.coverImage}
                        alt={featuredProject.title}
                      />
                    ) : (
                      <div className="project-featured__placeholder">
                        Project
                      </div>
                    )}

                    <span className="project-featured__index">
                      01
                    </span>

                  </div>

                  <div className="project-featured__content">

                    <p className="project-card__meta">
                      {[
                        featuredProject.sector,
                        featuredProject.serviceType,
                      ]
                        .filter(Boolean)
                        .join(' / ') || 'Project'}
                    </p>

                    <h2>
                      {featuredProject.title}
                    </h2>

                    {featuredProject.summary && (
                      <p className="project-featured__summary">
                        {featuredProject.summary}
                      </p>
                    )}

                    {featuredProject.outcome && (
                      <div className="project-featured__outcome">
                        <span>Outcome</span>
                        <p>
                          {featuredProject.outcome}
                        </p>
                      </div>
                    )}

                    <div className="project-featured__footer">

                      {featuredProject.status && (
                        <span
                          className={`project-card__status status--${featuredProject.status.toLowerCase()}`}
                        >
                          {featuredProject.status.replace(
                            '_',
                            ' '
                          )}
                        </span>
                      )}

                      <Link
                        to={`/projects/${featuredProject._id}`}
                        className="project-link"
                      >
                        View case study
                        <span aria-hidden="true">↗</span>
                      </Link>

                    </div>

                  </div>

                </Reveal>
              )}

              {/* =================================================
                  PROJECT GRID
              ================================================= */}

              {remainingProjects.length > 0 && (
                <div className="projects-grid">

                  {remainingProjects.map(
                    (project, index) => (
                      <Reveal
                        key={project._id}
                        className="project-card"
                        delay={(index % 3) * 80}
                      >

                        <Link
                          to={`/projects/${project._id}`}
                          className="project-card__image"
                        >

                          {project.coverImage ? (
                            <img
                              src={project.coverImage}
                              alt={project.title}
                            />
                          ) : (
                            <div className="project-card__placeholder">
                              Project
                            </div>
                          )}

                          <span className="project-card__number">
                            {String(index + 2).padStart(2, '0')}
                          </span>

                          <span className="project-card__arrow">
                            ↗
                          </span>

                        </Link>

                        <div className="project-card__body">

                          <p className="project-card__meta">
                            {[
                              project.sector,
                              project.serviceType,
                            ]
                              .filter(Boolean)
                              .join(' / ') || 'Project'}
                          </p>

                          <h3>
                            {project.title}
                          </h3>

                          {project.summary && (
                            <p className="project-card__summary">
                              {project.summary}
                            </p>
                          )}

                          {project.outcome && (
                            <div className="project-card__outcome">
                              <span>Outcome</span>
                              <p>
                                {project.outcome}
                              </p>
                            </div>
                          )}

                          <div className="project-card__footer">

                            {project.status && (
                              <span
                                className={`project-card__status status--${project.status.toLowerCase()}`}
                              >
                                {project.status.replace(
                                  '_',
                                  ' '
                                )}
                              </span>
                            )}

                            <span className="project-card__view">
                              View project
                            </span>

                          </div>

                        </div>

                      </Reveal>
                    )
                  )}

                </div>
              )}

              {/* =================================================
                  BOTTOM CTA
              ================================================= */}

              <Reveal className="projects-cta">

                <div>
                  <p className="kicker">
                    Have a project in mind?
                  </p>

                  <h2>
                    Let's bring structure
                    <br />
                    to your next project.
                  </h2>
                </div>

                <Link
                  to="/consultation"
                  className="btn btn--light"
                >
                  Start a Conversation
                  <span>↗</span>
                </Link>

              </Reveal>

            </>
          )}

        </div>
      </section>

    </div>
  );
};

export default Projects;