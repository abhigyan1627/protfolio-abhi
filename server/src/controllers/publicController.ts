import type { RequestHandler } from 'express';
import { prisma } from '../config/prisma.js';
import {
  getPublicResource,
  getSiteSettings,
  listPublicFaqs,
  listPublicResources,
  toPublicSettings,
} from '../services/contentService.js';
import { getPublicPlan, getPublicService, listPublicPlans, listPublicServices } from '../services/catalogService.js';
import { faqsQuerySchema } from '../validators/content.js';
import { plansQuerySchema, servicesQuerySchema } from '../validators/catalog.js';
import { parse } from '../utils/validation.js';
import { routeParam } from '../utils/http.js';
import { logger } from '../utils/logger.js';

export const healthCheck: RequestHandler = async (_req, res) => {
  const checkedAt = new Date().toISOString();
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'up', checkedAt });
  } catch {
    logger.error('health_database_unreachable');
    res.status(503).json({ status: 'degraded', database: 'down', checkedAt });
  }
};

export const listServices: RequestHandler = async (req, res) => {
  const query = parse(servicesQuerySchema, req.query);
  res.json({ items: await listPublicServices(query.category) });
};

export const getService: RequestHandler = async (req, res) => {
  res.json(await getPublicService(routeParam(req, 'slug')));
};

export const listPlans: RequestHandler = async (req, res) => {
  const query = parse(plansQuerySchema, req.query);
  res.json({ items: await listPublicPlans(query) });
};

export const getPlan: RequestHandler = async (req, res) => {
  res.json(await getPublicPlan(routeParam(req, 'slug')));
};

export const listFaqs: RequestHandler = async (req, res) => {
  const query = parse(faqsQuerySchema, req.query);
  res.json({ items: await listPublicFaqs(query.scope) });
};

export const listResources: RequestHandler = async (_req, res) => {
  res.json({ items: await listPublicResources() });
};

export const getResource: RequestHandler = async (req, res) => {
  res.json(await getPublicResource(routeParam(req, 'slug')));
};

export const getPublicSiteSettings: RequestHandler = async (_req, res) => {
  res.json(toPublicSettings(await getSiteSettings()));
};
