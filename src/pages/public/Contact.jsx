import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { readError } from '../../api/client';
import PageHeader from '../../components/PageHeader';
import Reveal from '../../components/Reveal';
import { useSite } from '../../context/SiteContext';
import { company, serviceOptions } from '../../data/siteContent';
import './Contact.css';

const emptyForm = { name: '', company: '', email: '', phone: '', service: '', message: '' };

const Contact = () => {
  const { settings } = useSite();
  const contact = settings.contact || {};
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'sending', message: '' });
    try {
      const { data } = await api.post('/leads/contact', form);
      setStatus({ state: 'sent', message: `${data.message} Reference: ${data.leadId}` });
      setForm(emptyForm);
    } catch (error) {
      setStatus({ state: 'error', message: readError(error, 'We could not send your enquiry. Please try again.') });
    }
  };

  return (
    <div className="contact-page">
      <PageHeader
        eyebrow="Contact"
        title="Tell us what you need managed."
        intro="Send an enquiry and our team will respond with next steps. For a detailed project brief, use the consultation form instead."
      />

      <section className="section contact-body">
        <div className="shell contact-grid">
          <Reveal className="contact-info">
            <h2>Reach the office</h2>

            <div className="contact-info__item">
              <p className="contact-info__label">Location</p>
              <p className="contact-info__value">{contact.address || company.location}</p>
            </div>

            <div className="contact-info__item">
              <p className="contact-info__label">Email</p>
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className="contact-info__value">{contact.email}</a>
              ) : (
                <p className="contact-info__placeholder">To be published — manage in admin settings</p>
              )}
            </div>

            <div className="contact-info__item">
              <p className="contact-info__label">Phone</p>
              {contact.phone ? (
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="contact-info__value">{contact.phone}</a>
              ) : (
                <p className="contact-info__placeholder">To be published — manage in admin settings</p>
              )}
            </div>

            <div className="contact-info__item">
              <p className="contact-info__label">Website</p>
              {contact.website ? (
                <a href={contact.website} target="_blank" rel="noreferrer" className="contact-info__value">
                  {contact.website.replace(/^https?:\/\//, '')}
                </a>
              ) : (
                <p className="contact-info__placeholder">To be published — manage in admin settings</p>
              )}
            </div>

            {contact.workingHours && (
              <div className="contact-info__item">
                <p className="contact-info__label">Working hours</p>
                <p className="contact-info__value">{contact.workingHours}</p>
              </div>
            )}

            <div className="contact-info__cta">
              <p>Have a defined project with a timeline?</p>
              <Link to="/consultation" className="btn btn--gold">Discuss Your Project</Link>
            </div>
          </Reveal>

          <Reveal className="contact-form-wrap" delay={120}>
            <h2>Send an enquiry</h2>

            {status.state === 'sent' && <div className="form-alert form-alert--ok">{status.message}</div>}
            {status.state === 'error' && <div className="form-alert form-alert--error">{status.message}</div>}

            <form onSubmit={submit} noValidate>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="c-name">Name</label>
                  <input id="c-name" name="name" value={form.name} onChange={change} required placeholder="Your full name" />
                </div>
                <div className="field">
                  <label htmlFor="c-company">Company</label>
                  <input id="c-company" name="company" value={form.company} onChange={change} placeholder="Company or organization" />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="c-email">Email</label>
                  <input id="c-email" type="email" name="email" value={form.email} onChange={change} required placeholder="name@company.com" />
                </div>
                <div className="field">
                  <label htmlFor="c-phone">Phone</label>
                  <input id="c-phone" name="phone" value={form.phone} onChange={change} placeholder="With country code" />
                </div>
              </div>

              <div className="field">
                <label htmlFor="c-service">Service</label>
                <select id="c-service" name="service" value={form.service} onChange={change}>
                  <option value="">Select a service</option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="c-message">Message</label>
                <textarea id="c-message" name="message" value={form.message} onChange={change} required placeholder="What would you like help with?" />
              </div>

              <button type="submit" className="btn btn--green contact-submit" disabled={status.state === 'sending'}>
                {status.state === 'sending' ? 'Sending…' : 'Send enquiry'}
              </button>
              <p className="form-note">Your details are stored in our system only to respond to this enquiry.</p>
            </form>
          </Reveal>
        </div>
      </section>

      {contact.mapEmbed && (
        <section className="contact-map">
          <iframe src={contact.mapEmbed} title="Office location" loading="lazy" allowFullScreen />
        </section>
      )}
    </div>
  );
};

export default Contact;
