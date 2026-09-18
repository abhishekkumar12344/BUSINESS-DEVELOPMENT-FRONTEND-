import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';
import { company } from '../data/siteContent';

const SiteContext = createContext(null);

const fallback = {
  companyName: company.name,
  tagline: company.tagline,
  logo: '/nisha-logo.jpeg',
  heroImage: company.heroImage,
  aboutImage: company.aboutImage,
  contact: { email: '', phone: '', website: '', address: company.location, workingHours: '' },
  social: {},
  homepage: { heroTitle: company.tagline, heroSubtitle: company.heroSubtitle }
};

/** Loads editable website settings once and shares them with header, footer and contact pages. */
export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .get('/settings')
      .then(({ data }) => {
        if (data?.settings) setSettings({ ...fallback, ...data.settings });
      })
      .catch(() => setSettings(fallback))
      .finally(() => setLoaded(true));
  }, []);

  return <SiteContext.Provider value={{ settings, loaded, setSettings }}>{children}</SiteContext.Provider>;
};

export const useSite = () => useContext(SiteContext) || { settings: fallback, loaded: true };
