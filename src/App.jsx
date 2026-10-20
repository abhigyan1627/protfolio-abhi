import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import AboutPage from './pages/About'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/Home'
import Legal from './pages/Legal'
import NotFound from './pages/NotFound'
import PricingPage from './pages/Pricing'
import ResourcesPage from './pages/Resources'
import ServiceDetailPage from './pages/ServiceDetail'
import ServicesPage from './pages/Services'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/:serviceId" element={<ServiceDetailPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy" element={<Legal pageKey="privacy" />} />
        <Route path="terms" element={<Legal pageKey="terms" />} />
        <Route path="disclaimer" element={<Legal pageKey="disclaimer" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
