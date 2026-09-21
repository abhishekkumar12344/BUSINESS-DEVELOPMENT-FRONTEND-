import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Reveal from '../../components/Reveal';
import { audiences, services, pageImages } from '../../data/siteContent';
import './Industries.css';

const reach = [
  { title: 'Local', text: 'Clients and partners in Surat and across Gujarat.' },
  { title: 'National', text: 'Businesses and organizations elsewhere in India.' },
  { title: 'International', text: 'Overseas clients and business partners.' }
];

const Industries = () => (
  <div className="industries-page">
    <PageHeader
      eyebrow="Industries & business opportunities"
      title="Positioned to support work across a range of sectors."
      intro="Our management and coordination capabilities can be adapted to different business environments and project requirements."
      image={pageImages.skyline}
    />

    <section className="section industries-who">
      <div className="shell">
        <Reveal className="industries-who__head">
          <p className="kicker">Who we work with</p>
          <h2>Four kinds of client, one kind of support.</h2>
        </Reveal>
        <div className="industries-who__grid">
          {audiences.map((item, i) => (
            <Reveal key={item.title} className="industries-card" delay={i * 70}>
              <span className="industries-card__index">{String(i + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="section section--tint industries-reach">
      <div className="shell industries-reach__grid">
        <Reveal>
          <p className="kicker">Working reach</p>
          <h2>Open to local, national and international engagements.</h2>
          <p>
            We welcome opportunities to work with clients, businesses, entrepreneurs, organizations and strategic
            partners. Where the work is located matters less than how clearly it can be planned and coordinated.
          </p>
        </Reveal>
        <div className="industries-reach__list">
          {reach.map((item, i) => (
            <Reveal key={item.title} className="industries-reach__item" delay={i * 80}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="section industries-fit">
      <div className="shell">
        <Reveal className="industries-fit__head">
          <p className="kicker">Where our services apply</p>
          <h2>Any sector where work has to be planned, coordinated and tracked.</h2>
        </Reveal>
        <div className="industries-fit__grid">
          {services.map((service) => (
            <Reveal key={service.slug} className="industries-fit__item">
              <span>{service.number}</span>
              <div>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <Link to={`/services/${service.slug}`} className="text-link">Service details</Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="section section--forest industries-cta">
      <div className="shell industries-cta__inner">
        <Reveal>
          <h2>Have an opportunity or a partnership in mind?</h2>
          <p>Tell us about it. We are open to conversations with clients and business partners at any stage.</p>
          <div className="industries-cta__actions">
            <Link to="/consultation" className="btn btn--gold">Discuss Your Project</Link>
            <Link to="/contact" className="btn btn--ghost">Contact the team</Link>
          </div>
        </Reveal>
      </div>
    </section>
  </div>
);

export default Industries;
