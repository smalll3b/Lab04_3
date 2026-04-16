export type ApiArticle = Record<string, unknown>;

const firstString = (article: ApiArticle, keys: string[]) => {
  for (const key of keys) {
    const value = article[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
    if (typeof value === 'number') {
      return String(value);
    }
  }

  return '';
};

export type NormalizedArticle = {
  id: string;
  title: string;
  body: string;
  image?: string;
  raw: ApiArticle;
};

export const normalizeArticle = (article: ApiArticle): NormalizedArticle => {
  const idValue = article.id ?? article.ID ?? article.articleId ?? article.article_id ?? '';
  const id = typeof idValue === 'number' ? String(idValue) : String(idValue);
  const title = firstString(article, ['title', 'name', 'headline', 'subject']) || `Article ${id || '?'}`;
  const body = firstString(article, ['fullText', 'fulltext', 'content', 'body', 'description', 'articleText', 'text']) || 'No article content available.';
  const image = firstString(article, ['image', 'imageURL', 'imageUrl', 'cover', 'thumbnail']) || undefined;

  return {
    id,
    title,
    body,
    image,
    raw: article,
  };
};

