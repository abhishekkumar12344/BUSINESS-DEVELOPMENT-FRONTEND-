import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { company } from '../data/siteContent';
import './Footer.css';

const Footer = () => {
  const { settings } = useSite();
  const contact = settings.contact || {};
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="shell footer__top">
        <div className="footer__brand">
          <img src={settings.logo || '/nisha-logo.jpeg'} alt="" className="footer__logo" width="74" height="74" />
          <p className="footer__tagline">{settings.tagline || company.tagline}</p>
          <p className="footer__blurb">
            A professional business services company based in {contact.address || company.location}, supporting
            businesses, entrepreneurs and organizations with structured management.
          </p>
        </div>

        <div className="footer__col">
          <h3>Company</h3>
          <Link to="/about">About</Link>
          <Link to="/approach">Our approach</Link>
          <Link to="/why-nisha">Why Nisha</Link>
          <Link to="/team">Team</Link>
          <Link to="/insights">Insights</Link>
        </div>

        <div className="footer__col">
          <h3>Services</h3>
          <Link to="/services/project-management">Project management</Link>
          <Link to="/services/business-management">Business management</Link>
          <Link to="/services/strategic-business-support">Strategic business support</Link>
          <Link to="/services/business-coordination-consulting">Coordination &amp; consulting</Link>
          <Link to="/industries">Industries</Link>
        </div>

        <div className="footer__col footer__col--contact">
          <h3>Get in touch</h3>
          <p className="footer__contact-line">{contact.address || company.location}</p>
          {contact.email ? (
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          ) : (
            <span className="footer__placeholder">Email — add from admin settings</span>
          )}
          {contact.phone ? (
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
          ) : (
            <span className="footer__placeholder">Phone — add from admin settings</span>
          )}
          {contact.website ? (
            <a href={contact.website} target="_blank" rel="noreferrer">
              {contact.website.replace(/^https?:\/\//, '')}
            </a>
          ) : (
            <span className="footer__placeholder">Website — add from admin settings</span>
          )}
          <Link to="/consultation" className="btn btn--gold footer__cta">
            Discuss Your Project
          </Link>
        </div>
      </div>

      <div className="shell footer__bar">
        <p>© {year} {settings.companyName || company.name}. All rights reserved.</p>
        <p className="footer__bar-right">
          <span>{company.descriptor}</span>
          <Link to="/admin/login" className="footer__admin">Admin</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
