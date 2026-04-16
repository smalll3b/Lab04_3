import Router, { RouterContext } from "koa-router";
import { basicAuth } from '../controllers/auth';

const router = new Router({ prefix: '/api/v1' });

// Public endpoint - no auth needed
/**
 * Return a public greeting for the API root.
 */
router.get('/', async (ctx: RouterContext, next: any) => {
  ctx.body = { message: 'Public API return' };
  await next();
});

// Protected endpoint - requires Basic Auth credentials
/**
 * Protect the private endpoint with HTTP Basic authentication.
 */
router.get("/private", basicAuth);

export { router };
