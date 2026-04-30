import * as db from '../helpers/database';
import fs from 'fs';
import path from 'path';

type ArticleRecord = Record<string, unknown>;

const FALLBACK_ARTICLES_PATHS = [
  path.resolve(process.cwd(), 'client', 'src', 'data', 'articles.json'),
  path.resolve(__dirname, '..', 'client', 'src', 'data', 'articles.json'),
];

const ALLOWED_ORDER_COLUMNS = new Set(['id', 'title']);

const loadFallbackArticles = (): ArticleRecord[] => {
  for (const candidate of FALLBACK_ARTICLES_PATHS) {
    if (fs.existsSync(candidate)) {
      try {
        const raw = fs.readFileSync(candidate, 'utf8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as ArticleRecord[]) : [];
      } catch (error) {
        console.warn('Unable to load fallback articles JSON.', error);
        return [];
      }
    }
  }

  return [];
};

const getArticleId = (article: ArticleRecord) => article.id ?? article.ID ?? article.articleId ?? article.article_id;

const sortFallbackArticles = (articles: ArticleRecord[], order: string) => {
  const column = ALLOWED_ORDER_COLUMNS.has(order) ? order : 'id';

  return [...articles].sort((left, right) => {
    const leftValue = left[column];
    const rightValue = right[column];

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue - rightValue;
    }

    return String(leftValue ?? '').localeCompare(String(rightValue ?? ''));
  });
};

//get a single article by its id
/**
 * Fetch a single article by identifier.
 */
export const getById = async (id: any) => {
  let query = "SELECT * FROM articles WHERE ID = ?"
  let values = [id]
  try {
    let data = await db.run_query(query, values);
    return data;
  } catch (error) {
    console.warn('Database article lookup failed, using fallback articles.', error);
    return loadFallbackArticles().filter((article) => String(getArticleId(article)) === String(id));
  }
}

//list all the articles in the database
/**
 * Fetch a paginated list of articles.
 */
export const getAll = async (page: number = 1, limit: number = 10, order: string = 'id') => {
  const offset = (page - 1) * limit;
  const sortColumn = ALLOWED_ORDER_COLUMNS.has(order) ? order : 'id';
  let query = `SELECT * FROM articles ORDER BY ${sortColumn} LIMIT ? OFFSET ?`;

  try {
    let data = await db.run_query(query, [limit, offset]);
    return data;
  } catch (error) {
    console.warn('Database article listing failed, using fallback articles.', error);
    const articles = sortFallbackArticles(loadFallbackArticles(), sortColumn);
    return articles.slice(offset, offset + limit);
  }
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
