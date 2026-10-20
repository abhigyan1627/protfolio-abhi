import { Router } from 'express';
import {
  createPublicEnquiry,
} from '../controllers/enquiryController.js';
import {
  getPlan,
  getPublicSiteSettings,
  getResource,
  getService,
  healthCheck,
  listFaqs,
  listPlans,
  listResources,
  listServices,
} from '../controllers/publicController.js';
import type { RateLimiters } from './index.js';

export function createPublicRouter(limiters: RateLimiters): Router {
  const router = Router();

  router.get('/health', healthCheck);
  router.get('/services', listServices);
  router.get('/services/:slug', getService);
  router.get('/plans', listPlans);
  router.get('/plans/:slug', getPlan);
  router.get('/faqs', listFaqs);
  router.get('/resources', listResources);
  router.get('/resources/:slug', getResource);
  router.get('/site-settings/public', getPublicSiteSettings);

  router.post('/enquiries', limiters.enquiry, createPublicEnquiry);

  return router;
}
