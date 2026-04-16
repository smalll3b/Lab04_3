import * as db from '../helpers/database';

//get a single article by its id
/**
 * Fetch a single article by identifier.
 */
export const getById = async (id: any) => {
  let query = "SELECT * FROM articles WHERE ID = ?"
  let values = [id]
  let data = await db.run_query(query, values);
  return data;
}

//list all the articles in the database
/**
 * Fetch a paginated list of articles.
 */
export const getAll = async (page: number = 1, limit: number = 10, order: string = 'id') => {
  const offset = (page - 1) * limit;
  let query = `SELECT * FROM articles ORDER BY ${order} LIMIT ? OFFSET ?`;
  let data = await db.run_query(query, [limit, offset]);
  return data;
}

//create a new article in the database
/**
 * Insert a new article record.
 */
export const add = async (article: any) => {
  let keys = Object.keys(article);
  let values = Object.values(article);
  let key = keys.join(',');
  let param = '';
  for(let i: number=0; i<values.length; i++){ param +='?,'}
  param=param.slice(0,-1);
  let query = `INSERT INTO articles (${key}) VALUES (${param})`;
  try{
    await db.run_insert(query, values);
    return {status: 201};
  } catch(err: any) {
    return err;
  }
}

//update an existing article in the database
/**
 * Update an existing article record by identifier.
 */
export const update = async (id: any, article: any) => {
  let keys = Object.keys(article);
  let values = Object.values(article);
  let setClause = keys.map((k) => `${k} = ?`).join(', ');
  values.push(id);
  let query = `UPDATE articles SET ${setClause} WHERE id = ?`;
  try {
    await db.run_insert(query, values);
    return { status: 200 };
  } catch (err: any) {
    return err;
  }
}

//delete an article from the database
/**
 * Delete an article record by identifier.
 */
export const remove = async (id: any) => {
  let query = "DELETE FROM articles WHERE id = ?";
  let values = [id];
  try {
    await db.run_insert(query, values);
    return { status: 200 };
  } catch (err: any) {
    return err;
  }
}
