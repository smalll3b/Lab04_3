import * as db from '../helpers/database';
import bcrypt from 'bcrypt';

//get all users
/**
 * Fetch all users without exposing password hashes.
 */
export const getAll = async () => {
  let query = "SELECT id, firstName, lastName, username, about, dateRegistered, email, avatarURL FROM users;";
  let data = await db.run_query(query, null);
  return data;
}

//get a single user by id
/**
 * Fetch a single user by identifier.
 */
export const getById = async (id: any) => {
  let query = "SELECT id, firstName, lastName, username, about, dateRegistered, email, avatarURL FROM users WHERE id = ?";
  let values = [id];
  let data = await db.run_query(query, values);
  return data;
}

//get a single user by username
/**
 * Fetch a user record by username without the password column.
 */
export const getByUsername = async (username: any) => {
  let query = "SELECT id, firstName, lastName, username, about, dateRegistered, email, avatarURL FROM users WHERE username = ?";
  let values = [username];
  let data = await db.run_query(query, values);
  return data;
}

//get a user by username including password (for login verification)
/**
 * Fetch a user record by username including the password hash.
 */
export const getByUsernameWithPassword = async (username: any) => {
  let query = "SELECT * FROM users WHERE username = ?";
  let values = [username];
  let data = await db.run_query(query, values);
  return data;
}

//create a new user
/**
 * Insert a new user record, hashing the supplied password before storage.
 */
export const add = async (user: any) => {
  if (!user.password) {
    throw new Error('Password is required');
  }
  const saltRounds = 10;
  user.password = await bcrypt.hash(user.password, saltRounds);

  let keys = Object.keys(user);
  let values = Object.values(user);
  let key = keys.join(',');
  let param = '';
  for (let i: number = 0; i < values.length; i++) { param += '?,'; }
  param = param.slice(0, -1);
  let query = `INSERT INTO users (${key}) VALUES (${param})`;
  try {
    await db.run_insert(query, values);
    return { status: 201 };
  } catch (err: any) {
    return err;
  }
}

//update an existing user
/**
 * Update an existing user record by identifier.
 */
export const update = async (id: any, user: any) => {
  let keys = Object.keys(user);
  let values = Object.values(user);
  let setClause = keys.map((k) => `${k} = ?`).join(', ');
  values.push(id);
  let query = `UPDATE users SET ${setClause} WHERE id = ?`;
  try {
    await db.run_insert(query, values);
    return { status: 200 };
  } catch (err: any) {
    return err;
  }
}

//delete a user
/**
 * Delete a user record by identifier.
 */
export const remove = async (id: any) => {
  let query = "DELETE FROM users WHERE id = ?";
  let values = [id];
  try {
    await db.run_insert(query, values);
    return { status: 200 };
  } catch (err: any) {
    return err;
  }
}
