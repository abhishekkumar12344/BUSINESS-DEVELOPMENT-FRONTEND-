import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Reveal from '../../components/Reveal';
import { whyNisha } from '../../data/siteContent';
import './WhyNisha.css';

const expanded = {
  '01': 'Assignments are set up the same way every time: a defined scope, named responsibilities, agreed checkpoints and written follow-up.',
  '02': 'Before proposing anything, we spend time on the objective, the constraints and the people involved. The approach follows the requirement, not a template.',
  '03': 'Recommendations have to survive contact with a real business. We favour solutions that your team can operate without us in the room.',
  '04': 'Status, risks and decisions are communicated in plain language, in writing, to the people who need them.',
  '05': 'Engagements scale up or down. Some clients need coordination for a few weeks, others need ongoing management support.',
  '06': 'We would rather be the partner a client returns to than the vendor they used once. That shapes how we price, report and behave.'
};

const WhyNisha = () => {
  const [open, setOpen] = useState('01');

  return (
    <div className="why-page">
      <PageHeader
        eyebrow="Why Nisha"
        title="Six reasons clients hand work to us."
        intro="We are not the only way to manage a project. These are the things we hold to, so you can judge whether they match how you want to work."
      />

      <section className="section why-list">
        <div className="shell">
          {whyNisha.map((item, i) => {
            const isOpen = open === item.number;
            return (
              <Reveal key={item.number} className={`why-row ${isOpen ? 'is-open' : ''}`} delay={i * 50}>
                <button
                  type="button"
                  className="why-row__head"
                  onClick={() => setOpen(isOpen ? '' : item.number)}
                  aria-expanded={isOpen}
                >
                  <span className="why-row__num">{item.number}</span>
                  <h2>{item.title}</h2>
                  <span className="why-row__icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M9 3v12M3 9h12" />
                    </svg>
                  </span>
                </button>
                <div className="why-row__body" hidden={!isOpen}>
                  <p className="why-row__lead">{item.description}</p>
                  <p className="why-row__more">{expanded[item.number]}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="section section--forest why-cta">
        <div className="shell why-cta__grid">
          <Reveal>
            <p className="kicker">Next step</p>
            <h2>See whether this way of working fits your project.</h2>
          </Reveal>
          <Reveal delay={100}>
            <p>
              Send us the objective and the constraints. We will tell you honestly whether we are the right support for
              it, and how we would run it if we are.
            </p>
            <div className="why-cta__actions">
              <Link to="/consultation" className="btn btn--gold">Discuss Your Project</Link>
              <Link to="/approach" className="btn btn--ghost">Read our method</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default WhyNisha;
