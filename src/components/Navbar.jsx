import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import './Navbar.css';

const links = [
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/approach', label: 'Approach' },
  { to: '/why-nisha', label: 'Why Nisha' },
  { to: '/industries', label: 'Industries' },
  { to: '/projects', label: 'Projects' },
  { to: '/team', label: 'Team' },
  { to: '/insights', label: 'Insights' },
  { to: '/contact', label: 'Contact' }
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { settings } = useSite();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav__inner shell">
        <Link to="/" className="nav__brand" aria-label={`${settings.companyName} home`}>
          <img src={settings.logo || '/nisha-logo.jpeg'} alt="" className="nav__logo" width="52" height="52" />
          <span className="nav__brand-text">
            <span className="nav__brand-name">Nisha</span>
            <span className="nav__brand-sub">Project &amp; Business Management</span>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/consultation" className="btn btn--gold nav__cta">
          Discuss Your Project
        </Link>

        <button
          type="button"
          className="nav__burger"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-menu" className="nav__drawer" hidden={!open}>
        <nav aria-label="Mobile">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `nav__drawer-link ${isActive ? 'is-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/consultation" className="btn btn--gold nav__drawer-cta" onClick={() => setOpen(false)}>
            Discuss Your Project
          </Link>
        </nav>
        <p className="nav__drawer-note">{settings.contact?.address || 'Surat, Gujarat, India'}</p>
      </div>
    </header>
  );
};

export default Navbar;
