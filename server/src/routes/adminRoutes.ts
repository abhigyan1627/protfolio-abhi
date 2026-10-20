import { Router, type RequestHandler } from 'express';
import {
  adminCreateFaq,
  adminCreatePlan,
  adminCreateResource,
  adminCreateService,
  adminDeleteFaq,
  adminDeletePlan,
  adminDeleteResource,
  adminDeleteService,
  adminGetEnquiry,
  adminGetSettings,
  adminListEnquiries,
  adminListFaqs,
  adminListPlans,
  adminListResources,
  adminListServices,
  adminUpdateEnquiry,
  adminUpdateFaq,
  adminUpdatePlan,
  adminUpdateResource,
  adminUpdateService,
  adminUpdateSettings,
  dashboard,
} from '../controllers/adminController.js';
import { currentAdmin, login, logout } from '../controllers/adminAuthController.js';
import { requireAdmin, requireAllowedOrigin, requireCsrf, requireRole } from '../middleware/auth.js';
import type { RateLimiters } from './index.js';

// Every role can read. Owners and editors can change content. Only owners change site settings.
const readAny: RequestHandler[] = [requireAdmin];
const contentEditor: RequestHandler[] = [
  requireAdmin,
  requireRole('OWNER', 'EDITOR'),
  requireAllowedOrigin,
  requireCsrf,
];
const ownerOnly: RequestHandler[] = [requireAdmin, requireRole('OWNER'), requireAllowedOrigin, requireCsrf];

export function createAdminRouter(limiters: RateLimiters): Router {
  const router = Router();

  router.post('/auth/login', limiters.login, requireAllowedOrigin, login);
  router.post('/auth/logout', requireAdmin, requireAllowedOrigin, requireCsrf, logout);
  router.get('/auth/me', requireAdmin, currentAdmin);

  router.get('/dashboard', readAny, dashboard);

  router.get('/enquiries', readAny, adminListEnquiries);
  router.get('/enquiries/:id', readAny, adminGetEnquiry);
  router.patch('/enquiries/:id', contentEditor, adminUpdateEnquiry);

  router.get('/services', readAny, adminListServices);
  router.post('/services', contentEditor, adminCreateService);
  router.patch('/services/:id', contentEditor, adminUpdateService);
  router.delete('/services/:id', contentEditor, adminDeleteService);

  router.get('/plans', readAny, adminListPlans);
  router.post('/plans', contentEditor, adminCreatePlan);
  router.patch('/plans/:id', contentEditor, adminUpdatePlan);
  router.delete('/plans/:id', contentEditor, adminDeletePlan);

  router.get('/faqs', readAny, adminListFaqs);
  router.post('/faqs', contentEditor, adminCreateFaq);
  router.patch('/faqs/:id', contentEditor, adminUpdateFaq);
  router.delete('/faqs/:id', contentEditor, adminDeleteFaq);

  router.get('/resources', readAny, adminListResources);
  router.post('/resources', contentEditor, adminCreateResource);
  router.patch('/resources/:id', contentEditor, adminUpdateResource);
  router.delete('/resources/:id', contentEditor, adminDeleteResource);

  router.get('/settings', readAny, adminGetSettings);
  router.patch('/settings', ownerOnly, adminUpdateSettings);

  return router;
}
