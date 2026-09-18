import { useState } from 'react';
import api, { readError } from '../../api/client';
import PageHeader from '../../components/PageHeader';
import Reveal from '../../components/Reveal';
import { approach, serviceOptions, timelineOptions } from '../../data/siteContent';
import './Consultation.css';

const emptyForm = {
  name: '', company: '', email: '', phone: '',
  requirement: '', serviceRequired: '', timeline: '', message: ''
};

const Consultation = () => {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState({ state: 'idle', message: '', reference: '' });

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'sending', message: '', reference: '' });
    try {
      const { data } = await api.post('/leads/consultation', form);
      setStatus({ state: 'sent', message: data.message, reference: data.leadId });
      setForm(emptyForm);
      window.scrollTo({ top: 260, behavior: 'smooth' });
    } catch (error) {
      setStatus({ state: 'error', message: readError(error, 'We could not submit your request. Please try again.'), reference: '' });
    }
  };

  return (
    <div className="consultation-page">
      <PageHeader
        eyebrow="Consultation"
        title="Discuss your project."
        intro="Share the objective, the service you need and your timeline. We will review it and come back with a practical view of how the work can be planned and managed."
      />

      <section className="section consultation-body">
        <div className="shell consultation-grid">
          <Reveal className="consultation-form-wrap">
            {status.state === 'sent' ? (
              <div className="consultation-success">
                <span className="consultation-success__mark" aria-hidden="true">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12.5 9.5 18 20 6.5" />
                  </svg>
                </span>
                <h2>Request received</h2>
                <p>{status.message}</p>
                <p className="consultation-success__ref">
                  Your reference: <strong>{status.reference}</strong>
                </p>
                <button type="button" className="btn btn--outline" onClick={() => setStatus({ state: 'idle', message: '', reference: '' })}>
                  Submit another request
                </button>
              </div>
            ) : (
              <>
                <h2>Project brief</h2>
                {status.state === 'error' && <div className="form-alert form-alert--error">{status.message}</div>}

                <form onSubmit={submit} noValidate>
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="k-name">Name</label>
                      <input id="k-name" name="name" value={form.name} onChange={change} required placeholder="Your full name" />
                    </div>
                    <div className="field">
                      <label htmlFor="k-company">Company</label>
                      <input id="k-company" name="company" value={form.company} onChange={change} placeholder="Company or organization" />
                    </div>
                  </div>

                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="k-email">Email</label>
                      <input id="k-email" type="email" name="email" value={form.email} onChange={change} required placeholder="name@company.com" />
                    </div>
                    <div className="field">
                      <label htmlFor="k-phone">Phone</label>
                      <input id="k-phone" name="phone" value={form.phone} onChange={change} placeholder="With country code" />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="k-requirement">Requirement</label>
                    <input id="k-requirement" name="requirement" value={form.requirement} onChange={change} placeholder="In one line, what needs to be managed?" />
                  </div>

                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="k-service">Service required</label>
                      <select id="k-service" name="serviceRequired" value={form.serviceRequired} onChange={change} required>
                        <option value="">Select a service</option>
                        {serviceOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="k-timeline">Timeline</label>
                      <select id="k-timeline" name="timeline" value={form.timeline} onChange={change}>
                        <option value="">Select a timeline</option>
                        {timelineOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="k-message">Message</label>
                    <textarea id="k-message" name="message" value={form.message} onChange={change} placeholder="Objectives, scope, people involved, anything already decided" />
                  </div>

                  <button type="submit" className="btn btn--green consultation-submit" disabled={status.state === 'sending'}>
                    {status.state === 'sending' ? 'Submitting…' : 'Submit project brief'}
                  </button>
                  <p className="form-note">We use these details only to prepare a response to your request.</p>
                </form>
              </>
            )}
          </Reveal>

          <Reveal className="consultation-aside" delay={120}>
            <div className="consultation-steps">
              <h3>What happens next</h3>
              <ol>
                <li><span>1</span> We review your brief and check it against our current capacity.</li>
                <li><span>2</span> We come back to you with questions or an initial view.</li>
                <li><span>3</span> If it fits, we propose how the work would be planned and managed.</li>
              </ol>
            </div>

            <div className="consultation-method">
              <h3>How we will run it</h3>
              <ul>
                {approach.map((step) => (
                  <li key={step.title}>
                    <span>{step.number}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Consultation;
