import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import * as model from '../models/articles';

const router = new Router({ prefix: '/api/v1/articles' });

/**
 * Return a paginated list of articles.
 */
const getAll = async (ctx: RouterContext, next: any) => {
  const page = parseInt(ctx.query.page as string) || 1;
  const limit = parseInt(ctx.query.limit as string) || 10;
  const order = (ctx.query.order as string) || 'id';
  let articles = await model.getAll(page, limit, order);
  if (articles.length) {
    ctx.body = articles;
  } else {
    ctx.body = {};
  }
  await next();
}

/**
 * Return a single article by numeric identifier.
 */
const getById = async (ctx: RouterContext, next: any) => {
  let id = ctx.params.id;
  let article = await model.getById(id);
  if (article.length) {
    ctx.body = article[0];
  } else {
    ctx.status = 404;
  }
  await next();
}

/**
 * Create a new article record.
 */
const createArticle = async (ctx: RouterContext, next: any) => {
  const body = ctx.request.body;
  let result = await model.add(body);
  if (result.status == 201) {
    ctx.status = 201;
    ctx.body = body;
  } else {
    ctx.status = 500;
    ctx.body = { err: "insert data failed" };
  }
  await next();
}

/**
 * Update an existing article record.
 */
const updateArticle = async (ctx: RouterContext, next: any) => {
  let id = ctx.params.id;
  const body = ctx.request.body;
  let result = await model.update(id, body);
  if (result.status == 200) {
    ctx.status = 200;
    ctx.body = { message: `Article ${id} updated successfully` };
  } else {
    ctx.status = 500;
    ctx.body = { err: "update data failed" };
  }
  await next();
}

/**
 * Delete an article record by identifier.
 */
const deleteArticle = async (ctx: RouterContext, next: any) => {
  let id = ctx.params.id;
  let result = await model.remove(id);
  if (result.status == 200) {
    ctx.status = 200;
    ctx.body = { message: `Article ${id} deleted successfully` };
  } else {
    ctx.status = 500;
    ctx.body = { err: "delete data failed" };
  }
  await next();
}

router.get('/', getAll);
router.post('/', bodyParser(), createArticle);
router.get('/:id', getById);
router.put('/:id', bodyParser(), updateArticle);
router.del('/:id', deleteArticle);

export { router };