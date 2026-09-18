import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import PageHeader from '../../components/PageHeader';
import Reveal from '../../components/Reveal';
import { approach as fallbackApproach } from '../../data/siteContent';
import './Approach.css';

const Approach = () => {
  const [steps, setSteps] = useState(fallbackApproach);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let alive = true;
    api
      .get('/content/approach')
      .then(({ data }) => {
        if (alive && data?.items?.length) setSteps(data.items);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  return (
    <div className="approach-page">
      <PageHeader
        eyebrow="Our approach"
        title="Plan, organize, execute, monitor, deliver."
        intro="Successful projects and businesses require clear planning, effective communication, disciplined execution and continuous monitoring. Our approach is built around five key principles."
      />

      <section className="section approach-timeline">
        <div className="shell">
          <div className="approach-track" role="tablist" aria-label="Approach steps">
            {steps.map((step, i) => (
              <button
                key={step.title}
                role="tab"
                aria-selected={active === i}
                className={`approach-node ${active === i ? 'is-active' : ''} ${i < active ? 'is-done' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="approach-node__dot" aria-hidden="true" />
                <span className="approach-node__num">{step.number}</span>
                <span className="approach-node__title">{step.title}</span>
              </button>
            ))}
            <span className="approach-track__line" aria-hidden="true">
              <span style={{ width: `${(active / Math.max(steps.length - 1, 1)) * 100}%` }} />
            </span>
          </div>

          <Reveal className="approach-detail" key={active}>
            <div className="approach-detail__index">
              <span>{steps[active]?.number}</span>
              <p>Step {active + 1} of {steps.length}</p>
            </div>
            <div className="approach-detail__body">
              <h2>{steps[active]?.title}</h2>
              <p className="approach-detail__desc">{steps[active]?.description}</p>
              <p className="approach-detail__more">{steps[active]?.detail}</p>
              <div className="approach-detail__nav">
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => setActive((v) => Math.max(0, v - 1))}
                  disabled={active === 0}
                >
                  Previous step
                </button>
                <button
                  type="button"
                  className="btn btn--green"
                  onClick={() => setActive((v) => Math.min(steps.length - 1, v + 1))}
                  disabled={active === steps.length - 1}
                >
                  Next step
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--tint approach-all">
        <div className="shell">
          <Reveal className="approach-all__head">
            <p className="kicker">The full method</p>
            <h2>Every step, in sequence.</h2>
          </Reveal>
          <ol className="approach-all__list">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 70} className="approach-all__item">
                <span className="approach-all__num">{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <p className="muted">{step.detail}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section approach-cta">
        <div className="shell approach-cta__inner">
          <Reveal>
            <h2>Bring us a project and we will start at step one.</h2>
            <Link to="/consultation" className="btn btn--gold">Discuss Your Project</Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Approach;
