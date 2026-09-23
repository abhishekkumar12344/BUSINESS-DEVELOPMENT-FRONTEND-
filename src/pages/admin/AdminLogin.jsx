import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GrowthArc from '../../components/GrowthArc';
import './AdminLogin.css';

const AdminLogin = () => {
  const { login, user } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) navigate(location.state?.from || '/admin', { replace: true });
  }, [user, navigate, location.state]);

  const goAfterLogin = (loggedInUser) => {
    navigate(loggedInUser.role === 'SUPER_ADMIN' ? '/super-admin' : location.state?.from || '/admin', { replace: true });
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const result = await login(form.email, form.password);
    setBusy(false);
    if (result.ok) {
      goAfterLogin(result.user);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login">
      <div className="login__aside">
        <GrowthArc className="login__motif" />
        <div className="login__aside-inner">
          <img src="/nisha-logo.jpeg" alt="Nisha Project & Business Management LLC" className="login__logo" />
          <h1>Management console</h1>
          <p>
            Leads, enquiries, consultations and website content for Nisha Project &amp; Business Management LLC — all in
            one place.
          </p>
          <Link to="/" className="login__back">Back to website</Link>
        </div>
      </div>

      <div className="login__panel">
        <form className="login__form" onSubmit={submit} noValidate>
          <h2>Sign in</h2>
          <p className="login__sub">Use the account issued to you by your system administrator.</p>

          {error && <div className="admin-alert admin-alert--error login__error">{error}</div>}

          <div className="admin-field">
            <label htmlFor="l-email">Email</label>
            <input
              id="l-email"
              type="email"
              autoComplete="username"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="you@nisha.com"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="l-password">Password</label>
            <input
              id="l-password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              placeholder="Your password"
            />
          </div>

          <button type="submit" className="a-btn a-btn--primary login__submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="login__note">
            Sessions last 7 days. Sign in attempts are rate limited and every action is written to the activity log.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
