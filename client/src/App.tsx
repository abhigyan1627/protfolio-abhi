import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { LoadingBlock } from './components/ui/States';
import { AdminSessionProvider } from './hooks/AdminSessionProvider';
import { AdminLayout } from './layouts/AdminLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PricingPage } from './pages/PricingPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ServicesPage } from './pages/ServicesPage';
import { TermsPage } from './pages/TermsPage';
// Admin screens and the article renderer load on demand so public visitors do not download them.
const ResourceDetailPage = lazy(() => import('./pages/ResourceDetailPage').then((m) => ({ default: m.ResourceDetailPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminEnquiriesPage = lazy(() => import('./pages/admin/AdminEnquiriesPage').then((m) => ({ default: m.AdminEnquiriesPage })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const AdminPlansPage = lazy(() => import('./pages/admin/AdminPlansPage').then((m) => ({ default: m.AdminPlansPage })));
const AdminResourcesPage = lazy(() => import('./pages/admin/AdminResourcesPage').then((m) => ({ default: m.AdminResourcesPage })));
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage').then((m) => ({ default: m.AdminServicesPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })));

// Every /admin route runs inside the session provider. The server still checks the session on each request.
function AdminRoot() {
  return (
    <AdminSessionProvider>
      <Outlet />
    </AdminSessionProvider>
  );
}

export function App() {
  return (
    <Suspense fallback={<LoadingBlock label='Loading page' />}>
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/:slug" element={<ServiceDetailPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="resources/:slug" element={<ResourceDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="admin" element={<AdminRoot />}>
        <Route path="login" element={<AdminLoginPage />} />
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="enquiries" element={<AdminEnquiriesPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="plans" element={<AdminPlansPage />} />
          <Route path="resources" element={<AdminResourcesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
    </Suspense>
  );
}
