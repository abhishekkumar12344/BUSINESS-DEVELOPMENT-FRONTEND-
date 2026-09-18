import { useEffect, useState } from 'react';
import api, { readError } from '../../api/client';
import Loader from '../../components/Loader';
import { useSite } from '../../context/SiteContext';

/**
 * Everything on the public site that changes without a developer:
 * contact details, social links, homepage copy and SEO defaults.
 */
const Settings = () => {
  const { setSettings } = useSite();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    api
      .get('/settings')
      .then(({ data }) => setForm(data.settings))
      .catch((error) => setFeedback({ type: 'error', text: readError(error) }))
      .finally(() => setLoading(false));
  }, []);

  const setField = (group, name, value) =>
    setForm((f) => (group ? { ...f, [group]: { ...f[group], [name]: value } } : { ...f, [name]: value }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/admin/settings', {
        companyName: form.companyName,
        tagline: form.tagline,
        logo: form.logo,
        contact: form.contact,
        social: form.social,
        homepage: form.homepage,
        seo: form.seo,
        maintenanceMode: form.maintenanceMode
      });
      setForm(data.settings);
      setSettings((current) => ({ ...current, ...data.settings }));
      setFeedback({ type: 'ok', text: 'Settings saved. The website updates on the next page load.' });
    } catch (error) {
      setFeedback({ type: 'error', text: readError(error) });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading settings" />;
  if (!form) return <div className="admin-empty"><h3>Settings could not be loaded</h3><p>Check that the API is running, then reload this page.</p></div>;

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1>Website settings</h1>
          <p>Contact details, social links and homepage wording, without touching the code.</p>
        </div>
      </div>

      {feedback && (
        <div className={`admin-alert admin-alert--${feedback.type === 'ok' ? 'ok' : 'error'}`}>{feedback.text}</div>
      )}

      <form onSubmit={save}>
        <section className="admin-card">
          <div className="admin-card__head"><h2>Identity</h2></div>
          <div className="admin-grid-2">
            <div className="admin-field">
              <label htmlFor="companyName">Company name</label>
              <input id="companyName" value={form.companyName || ''} onChange={(e) => setField(null, 'companyName', e.target.value)} />
            </div>
            <div className="admin-field">
              <label htmlFor="tagline">Tagline</label>
              <input id="tagline" value={form.tagline || ''} onChange={(e) => setField(null, 'tagline', e.target.value)} />
            </div>
            <div className="admin-field">
              <label htmlFor="logo">Logo URL</label>
              <input id="logo" value={form.logo || ''} onChange={(e) => setField(null, 'logo', e.target.value)} />
              <span className="admin-field__hint">Upload a file in Media, then paste its URL here.</span>
            </div>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__head"><h2>Contact details</h2></div>
          <div className="admin-grid-2">
            <div className="admin-field">
              <label htmlFor="email">Business email</label>
              <input id="email" type="email" value={form.contact?.email || ''} onChange={(e) => setField('contact', 'email', e.target.value)} />
            </div>
            <div className="admin-field">
              <label htmlFor="phone">Business phone</label>
              <input id="phone" value={form.contact?.phone || ''} onChange={(e) => setField('contact', 'phone', e.target.value)} />
            </div>
            <div className="admin-field">
              <label htmlFor="website">Website</label>
              <input id="website" value={form.contact?.website || ''} onChange={(e) => setField('contact', 'website', e.target.value)} />
            </div>
            <div className="admin-field">
              <label htmlFor="hours">Working hours</label>
              <input id="hours" value={form.contact?.workingHours || ''} onChange={(e) => setField('contact', 'workingHours', e.target.value)} />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="address">Address</label>
              <input id="address" value={form.contact?.address || ''} onChange={(e) => setField('contact', 'address', e.target.value)} />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="mapEmbed">Google Maps embed URL</label>
              <input id="mapEmbed" value={form.contact?.mapEmbed || ''} onChange={(e) => setField('contact', 'mapEmbed', e.target.value)} />
              <span className="admin-field__hint">Paste the src URL from the Google Maps embed code to show a map on the contact page.</span>
            </div>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__head"><h2>Social profiles</h2></div>
          <div className="admin-grid-2">
            {['linkedin', 'instagram', 'facebook', 'twitter', 'youtube'].map((key) => (
              <div className="admin-field" key={key}>
                <label htmlFor={key}>{key[0].toUpperCase() + key.slice(1)}</label>
                <input id={key} value={form.social?.[key] || ''} onChange={(e) => setField('social', key, e.target.value)} placeholder="https://" />
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__head"><h2>Homepage copy</h2></div>
          <div className="admin-grid-2">
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="heroTitle">Hero headline</label>
              <input id="heroTitle" value={form.homepage?.heroTitle || ''} onChange={(e) => setField('homepage', 'heroTitle', e.target.value)} />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="heroSubtitle">Hero paragraph</label>
              <textarea id="heroSubtitle" rows={3} value={form.homepage?.heroSubtitle || ''} onChange={(e) => setField('homepage', 'heroSubtitle', e.target.value)} />
            </div>
            <div className="admin-field">
              <label htmlFor="primaryCta">Primary button</label>
              <input id="primaryCta" value={form.homepage?.primaryCta || ''} onChange={(e) => setField('homepage', 'primaryCta', e.target.value)} />
            </div>
            <div className="admin-field">
              <label htmlFor="secondaryCta">Secondary button</label>
              <input id="secondaryCta" value={form.homepage?.secondaryCta || ''} onChange={(e) => setField('homepage', 'secondaryCta', e.target.value)} />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="commitment">Commitment points</label>
              <textarea
                id="commitment"
                rows={7}
                value={(form.homepage?.commitmentPoints || []).join('\n')}
                onChange={(e) => setField('homepage', 'commitmentPoints', e.target.value.split('\n').map((l) => l.trim()).filter(Boolean))}
              />
              <span className="admin-field__hint">One point per line.</span>
            </div>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__head"><h2>Search engines</h2></div>
          <div className="admin-grid-2">
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="metaTitle">Default page title</label>
              <input id="metaTitle" value={form.seo?.metaTitle || ''} onChange={(e) => setField('seo', 'metaTitle', e.target.value)} />
            </div>
            <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="metaDescription">Default description</label>
              <textarea id="metaDescription" rows={2} value={form.seo?.metaDescription || ''} onChange={(e) => setField('seo', 'metaDescription', e.target.value)} />
            </div>
            <div className="admin-field admin-field--check">
              <label>
                <input type="checkbox" checked={Boolean(form.maintenanceMode)} onChange={(e) => setField(null, 'maintenanceMode', e.target.checked)} />
                Maintenance mode
              </label>
              <span className="admin-field__hint">Turn this on while you are reworking the public site.</span>
            </div>
          </div>
        </section>

        <div className="admin-head__actions">
          <button type="submit" className="a-btn a-btn--primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
