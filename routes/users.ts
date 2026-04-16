import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import bcrypt from 'bcrypt';
import * as model from '../models/users';

const router = new Router({ prefix: '/api/v1/users' });

/**
 * Return all users without password hashes.
 */
const getAll = async (ctx: RouterContext, next: any) => {
  let users = await model.getAll();
  if (users.length) {
    ctx.body = users;
  } else {
    ctx.body = {};
  }
  await next();
}

/**
 * Return a single user by numeric identifier.
 */
const getById = async (ctx: RouterContext, next: any) => {
  let id = ctx.params.id;
  let user = await model.getById(id);
  if (user.length) {
    ctx.body = user[0];
  } else {
    ctx.status = 404;
  }
  await next();
}

/**
 * Create a new user record and store the password as a bcrypt hash.
 */
const createUser = async (ctx: RouterContext, next: any) => {
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
 * Update an existing user record.
 */
const updateUser = async (ctx: RouterContext, next: any) => {
  let id = ctx.params.id;
  const body = ctx.request.body;
  let result = await model.update(id, body);
  if (result.status == 200) {
    ctx.status = 200;
    ctx.body = { message: `User ${id} updated successfully` };
  } else {
    ctx.status = 500;
    ctx.body = { err: "update data failed" };
  }
  await next();
}

/**
 * Delete a user record by identifier.
 */
const deleteUser = async (ctx: RouterContext, next: any) => {
  let id = ctx.params.id;
  let result = await model.remove(id);
  if (result.status == 200) {
    ctx.status = 200;
    ctx.body = { message: `User ${id} deleted successfully` };
  } else {
    ctx.status = 500;
    ctx.body = { err: "delete data failed" };
  }
  await next();
}

/**
 * Validate login credentials using the stored password hash.
 */
const login = async (ctx: RouterContext, next: any) => {
  const body = ctx.request.body as any;
  const { username, password } = body;
  const users = await model.getByUsernameWithPassword(username) as any[];
  if (users.length) {
    const valid = await bcrypt.compare(password, users[0].password);
    if (valid) {
      ctx.status = 200;
      ctx.body = { message: 'Login successful', id: users[0].id, username: users[0].username };
    } else {
      ctx.status = 401;
      ctx.body = { error: 'Invalid credentials' };
    }
  } else {
    ctx.status = 404;
    ctx.body = { error: 'User not found' };
  }
  await next();
}

router.get('/', getAll);
router.post('/', bodyParser(), createUser);
router.get('/:id', getById);
router.put('/:id', bodyParser(), updateUser);
router.del('/:id', deleteUser);
router.post('/login', bodyParser(), login);

export { router };
