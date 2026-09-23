import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Reveal from '../../components/Reveal';
import { pageImages, teamMembers as fallbackTeam } from '../../data/siteContent';
import './Team.css';

const Team = () => {
  const team = fallbackTeam;

  const initials = (name) =>
    name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  return (
    <div className="team-page">
      <PageHeader
        eyebrow="Our team"
        title="The people who manage the work."
        intro="Engagements are handled by named people who stay with your project from planning through to delivery."
        image={pageImages.team}
      />

      <section className="section team-body">
        <div className="shell">
          {team.length === 0 && (
            <Reveal className="team-empty">
              <h2>Team profiles are being added.</h2>
              <p>
                We are preparing profiles for the people who manage client engagements. In the meantime, you will be
                introduced to the person handling your work at the first conversation.
              </p>
              <Link to="/consultation" className="btn btn--green">Start a conversation</Link>
            </Reveal>
          )}

          {team.length > 0 && (
            <div className="team-grid">
              {team.map((member, i) => (
                <Reveal key={member._id} className="team-card" delay={i * 70}>
                  {member.photo ? (
                    <img src={member.photo} alt="" className="team-card__photo" />
                  ) : (
                    <span className="team-card__initials" aria-hidden="true">{initials(member.name)}</span>
                  )}
                  {member.isFounder && <span className="team-card__badge">Founder</span>}
                  <h3>{member.name}</h3>
                  <p className="team-card__role">{member.designation}</p>
                  {member.bio && <p className="team-card__bio">{member.bio}</p>}
                  <div className="team-card__links">
                    {member.email && <a href={`mailto:${member.email}`}>Email</a>}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section--tint team-join">
        <div className="shell team-join__grid">
          <Reveal>
            <p className="kicker">Working with us</p>
            <h2>Interested in collaborating?</h2>
          </Reveal>
          <Reveal delay={100}>
            <p>
              We work with service providers, consultants and partners on client engagements. If your capability
              complements ours, we would like to hear from you.
            </p>
            <Link to="/contact" className="btn btn--outline">Get in touch</Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Team;
