import type { RequestHandler } from 'express';
import { getDashboard } from '../services/dashboardService.js';
import {
  createService,
  createPlan,
  deletePlan,
  deleteService,
  listAdminPlans,
  listAdminServices,
  updatePlan,
  updateService,
} from '../services/catalogService.js';
import {
  createFaq,
  createResource,
  deleteFaq,
  deleteResource,
  getSiteSettings,
  listAdminFaqs,
  listAdminResources,
  toPublicSettings,
  updateFaq,
  updateResource,
  updateSiteSettings,
} from '../services/contentService.js';
import { getEnquiry, listEnquiries, updateEnquiry } from '../services/enquiryService.js';
import { routeParam } from '../utils/http.js';
import { parse } from '../utils/validation.js';
import { planCreateSchema, planUpdateSchema, serviceCreateSchema, serviceUpdateSchema } from '../validators/catalog.js';
import { enquiryListQuerySchema, enquiryStatusUpdateSchema } from '../validators/enquiry.js';
import { faqCreateSchema, faqUpdateSchema, resourceCreateSchema, resourceUpdateSchema, settingsUpdateSchema } from '../validators/content.js';
import { logger } from '../utils/logger.js';

// Dashboard and enquiries
export const dashboard: RequestHandler = async (_req, res) => {
  res.json(await getDashboard());
};

export const adminListEnquiries: RequestHandler = async (req, res) => {
  res.json(await listEnquiries(parse(enquiryListQuerySchema, req.query)));
};

export const adminGetEnquiry: RequestHandler = async (req, res) => {
  res.json(await getEnquiry(routeParam(req, 'id')));
};

export const adminUpdateEnquiry: RequestHandler = async (req, res) => {
  const patch = parse(enquiryStatusUpdateSchema, req.body);
  const updated = await updateEnquiry(routeParam(req, 'id'), patch);
  logger.info('enquiry_updated', { id: updated.id, status: updated.status });
  res.json(updated);
};

// Services
export const adminListServices: RequestHandler = async (_req, res) => {
  res.json({ items: await listAdminServices() });
};

export const adminCreateService: RequestHandler = async (req, res) => {
  const input = parse(serviceCreateSchema, req.body);
  res.status(201).json(await createService(input));
};

export const adminUpdateService: RequestHandler = async (req, res) => {
  const patch = parse(serviceUpdateSchema, req.body);
  res.json(await updateService(routeParam(req, 'id'), patch));
};

export const adminDeleteService: RequestHandler = async (req, res) => {
  await deleteService(routeParam(req, 'id'));
  res.status(204).end();
};

// Plans
export const adminListPlans: RequestHandler = async (_req, res) => {
  res.json({ items: await listAdminPlans() });
};

export const adminCreatePlan: RequestHandler = async (req, res) => {
  const input = parse(planCreateSchema, req.body);
  res.status(201).json(await createPlan(input));
};

export const adminUpdatePlan: RequestHandler = async (req, res) => {
  const patch = parse(planUpdateSchema, req.body);
  res.json(await updatePlan(routeParam(req, 'id'), patch));
};

export const adminDeletePlan: RequestHandler = async (req, res) => {
  await deletePlan(routeParam(req, 'id'));
  res.status(204).end();
};

// FAQs
export const adminListFaqs: RequestHandler = async (_req, res) => {
  res.json({ items: await listAdminFaqs() });
};

export const adminCreateFaq: RequestHandler = async (req, res) => {
  res.status(201).json(await createFaq(parse(faqCreateSchema, req.body)));
};

export const adminUpdateFaq: RequestHandler = async (req, res) => {
  res.json(await updateFaq(routeParam(req, 'id'), parse(faqUpdateSchema, req.body)));
};

export const adminDeleteFaq: RequestHandler = async (req, res) => {
  await deleteFaq(routeParam(req, 'id'));
  res.status(204).end();
};

// Resources
export const adminListResources: RequestHandler = async (_req, res) => {
  res.json({ items: await listAdminResources() });
};

export const adminCreateResource: RequestHandler = async (req, res) => {
  res.status(201).json(await createResource(parse(resourceCreateSchema, req.body)));
};

export const adminUpdateResource: RequestHandler = async (req, res) => {
  res.json(await updateResource(routeParam(req, 'id'), parse(resourceUpdateSchema, req.body)));
};

export const adminDeleteResource: RequestHandler = async (req, res) => {
  await deleteResource(routeParam(req, 'id'));
  res.status(204).end();
};

// Site settings
export const adminGetSettings: RequestHandler = async (_req, res) => {
  res.json(await getSiteSettings());
};

export const adminUpdateSettings: RequestHandler = async (req, res) => {
  const patch = parse(settingsUpdateSchema, req.body);
  const updated = await updateSiteSettings(patch);
  logger.info('settings_updated', { fields: Object.keys(patch).length });
  res.json({ settings: updated, preview: toPublicSettings(updated) });
};
