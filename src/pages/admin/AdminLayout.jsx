import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';
import './admin.css';

const adminNav = [
  { to: '/admin', label: 'Dashboard', end: true, icon: 'grid' },
  { to: '/admin/leads', label: 'Leads', icon: 'users' },
  { to: '/admin/enquiries', label: 'Enquiries', icon: 'mail' },
  { to: '/admin/consultations', label: 'Consultations', icon: 'calendar' },
  { to: '/admin/services', label: 'Services', icon: 'layers' },
  { to: '/admin/approach', label: 'Approach', icon: 'route' },
  { to: '/admin/values', label: 'Values', icon: 'shield' },
  { to: '/admin/projects', label: 'Projects', icon: 'folder' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: 'quote' },
  { to: '/admin/team', label: 'Team', icon: 'user' },
  { to: '/admin/media', label: 'Media', icon: 'image' },
  { to: '/admin/insights', label: 'Insights', icon: 'file' },
  { to: '/admin/analytics', label: 'Analytics', icon: 'chart' },
  { to: '/admin/notifications', label: 'Notifications', icon: 'bell' },
  { to: '/admin/settings', label: 'Settings', icon: 'cog' }
];

const superNav = [
  { to: '/super-admin', label: 'Overview', end: true, icon: 'grid' },
  { to: '/super-admin/admins', label: 'Admin management', icon: 'users' },
  { to: '/super-admin/roles', label: 'Roles & permissions', icon: 'shield' },
  { to: '/super-admin/activity', label: 'Activity logs', icon: 'list' },
  { to: '/super-admin/settings', label: 'System settings', icon: 'cog' }
];

const icons = {
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  users: 'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M22 20v-2a4 4 0 0 0-3-3.87M16 4.13a4 4 0 0 1 0 7.75',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  calendar: 'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4',
  layers: 'M12 3 3 8l9 5 9-5-9-5ZM3 14l9 5 9-5',
  route: 'M6 4v10a4 4 0 0 0 4 4h8M18 14l3 4-3 4M6 4a2 2 0 1 0 0-.1',
  shield: 'M12 3 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-3Z',
  folder: 'M3 7h6l2 3h10v10H3z',
  quote: 'M8 7H4v6h4l-2 5M20 7h-4v6h4l-2 5',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  image: 'M3 5h18v14H3zM7 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M21 16l-6-6-9 9',
  file: 'M14 3H6v18h12V7zM14 3v4h4',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  bell: 'M18 9a6 6 0 1 0-12 0c0 6-3 7-3 7h18s-3-1-3-7M10.5 20a2 2 0 0 0 3 0',
  cog: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 15a2 2 0 1 1 0-4 1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 9 4.6V4a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 19.4 9H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 2Z',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'
};

const Icon = ({ name }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={icons[name] || icons.grid} />
  </svg>
);

const AdminLayout = ({ superAdmin = false }) => {
  const { user, logout, isSuperAdmin } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [unread, setUnread] = useState(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const nav = superAdmin ? superNav : adminNav;

  useEffect(() => setDrawerOpen(false), [pathname]);

  useEffect(() => {
    let alive = true;
    const load = () =>
      api
        .get('/admin/notifications')
        .then(({ data }) => alive && setUnread(data.unread || 0))
        .catch(() => {});
    load();
    const timer = setInterval(load, 60000);
    return () => { alive = false; clearInterval(timer); };
  }, [pathname]);

  const signOut = async () => {
    await logout();
    navigate('/admin/login');
  };

  const initials = (user?.name || 'A').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  return (
    <div className={`adm ${collapsed ? 'adm--collapsed' : ''} ${drawerOpen ? 'adm--drawer' : ''}`}>
      <aside className="adm__side">
        <div className="adm__brand">
          <img src="/nisha-logo.jpeg" alt="" width="40" height="40" />
          <span>
            <strong>Nisha</strong>
            <em>{superAdmin ? 'Super admin' : 'Admin panel'}</em>
          </span>
        </div>

        <nav className="adm__nav" aria-label="Admin sections">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `adm__link ${isActive ? 'is-active' : ''}`}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.label === 'Notifications' && unread > 0 && <i className="adm__dot">{unread}</i>}
            </NavLink>
          ))}
        </nav>

        <div className="adm__side-foot">
          {isSuperAdmin && (
            <Link to={superAdmin ? '/admin' : '/super-admin'} className="adm__switch">
              {superAdmin ? 'Go to admin panel' : 'Go to super admin'}
            </Link>
          )}
          <Link to="/" className="adm__switch adm__switch--muted">View website</Link>
        </div>
      </aside>

      <div className="adm__main">
        <header className="adm__top">
          <button type="button" className="adm__burger" onClick={() => setDrawerOpen((v) => !v)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
          <button type="button" className="adm__collapse" onClick={() => setCollapsed((v) => !v)} aria-label="Collapse sidebar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <p className="adm__title">{superAdmin ? 'Super admin control' : 'Nisha management console'}</p>

          <div className="adm__top-right">
            <Link to="/admin/notifications" className="adm__bell" aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}>
              <Icon name="bell" />
              {unread > 0 && <i>{unread > 9 ? '9+' : unread}</i>}
            </Link>
            <div className="adm__user">
              <span className="adm__avatar">{initials}</span>
              <span className="adm__user-text">
                <strong>{user?.name}</strong>
                <em>{user?.role?.replace('_', ' ').toLowerCase()}</em>
              </span>
            </div>
            <button type="button" className="a-btn a-btn--ghost a-btn--sm" onClick={signOut}>Sign out</button>
          </div>
        </header>

        <main className="adm__content">
          <Outlet />
        </main>
      </div>

      {drawerOpen && <button type="button" className="adm__scrim" onClick={() => setDrawerOpen(false)} aria-label="Close menu" />}
    </div>
  );
};

export default AdminLayout;
