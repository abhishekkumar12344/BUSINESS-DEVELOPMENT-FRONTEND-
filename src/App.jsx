import { Routes, Route, Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import ServiceDetail from './pages/public/ServiceDetail';
import Approach from './pages/public/Approach';
import WhyNisha from './pages/public/WhyNisha';
import Industries from './pages/public/Industries';
import Projects from './pages/public/Projects';
import Team from './pages/public/Team';
import Insights from './pages/public/Insights';
import InsightDetail from './pages/public/InsightDetail';
import Contact from './pages/public/Contact';
import Consultation from './pages/public/Consultation';
import NotFound from './pages/public/NotFound';

// Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Leads from './pages/admin/Leads';
import LeadDetail from './pages/admin/LeadDetail';
import Enquiries from './pages/admin/Enquiries';
import Consultations from './pages/admin/Consultations';
import ServicesManager from './pages/admin/ServicesManager';
import ApproachManager from './pages/admin/ApproachManager';
import ValuesManager from './pages/admin/ValuesManager';
import ProjectsManager from './pages/admin/ProjectsManager';
import TestimonialsManager from './pages/admin/TestimonialsManager';
import TeamManager from './pages/admin/TeamManager';
import InsightsManager from './pages/admin/InsightsManager';
import MediaLibrary from './pages/admin/MediaLibrary';
import Analytics from './pages/admin/Analytics';
import Notifications from './pages/admin/Notifications';
import Settings from './pages/admin/Settings';

// Super admin
import SuperAdminHome from './pages/superadmin/SuperAdminHome';
import AdminManagement from './pages/superadmin/AdminManagement';
import RolesPermissions from './pages/superadmin/RolesPermissions';
import ActivityLogs from './pages/superadmin/ActivityLogs';
import SystemSettings from './pages/superadmin/SystemSettings';

const PublicLayout = () => (
  <>
    <a href="#main" className="skip-link">Skip to content</a>
    <Navbar />
    <main id="main">
      <Outlet />
    </main>
    <Footer />
  </>
);

const App = () => (
  <>
    <ScrollToTop />
    <Routes>
      {/* ---------- Public website ---------- */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/approach" element={<Approach />} />
        <Route path="/why-nisha" element={<WhyNisha />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/team" element={<Team />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/insights/:slug" element={<InsightDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ---------- Admin ---------- */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="leads/:id" element={<LeadDetail />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="consultations" element={<Consultations />} />
        <Route
          path="services"
          element={
            <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']}>
              <ServicesManager />
            </ProtectedRoute>
          }
        />
        <Route path="approach" element={<ApproachManager />} />
        <Route path="values" element={<ValuesManager />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="testimonials" element={<TestimonialsManager />} />
        <Route path="team" element={<TeamManager />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="insights" element={<InsightsManager />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="notifications" element={<Notifications />} />
        <Route
          path="settings"
          element={
            <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN']}>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ---------- Super admin ---------- */}
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute roles={['SUPER_ADMIN']}>
            <AdminLayout superAdmin />
          </ProtectedRoute>
        }
      >
        <Route index element={<SuperAdminHome />} />
        <Route path="admins" element={<AdminManagement />} />
        <Route path="roles" element={<RolesPermissions />} />
        <Route path="activity" element={<ActivityLogs />} />
        <Route path="settings" element={<SystemSettings />} />
      </Route>
    </Routes>
  </>
);

export default App;
