import React from 'react';
import axios from 'axios';
import { Alert, Card, Col, Row, Spin, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { api } from '../common/http-common';
import { normalizeArticle, type NormalizedArticle } from '../common/article';

const { Paragraph, Title } = Typography;

const Articles = () => {
  const [articles, setArticles] = React.useState<NormalizedArticle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;

    const loadArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${api.uri}/articles`);
        const data = Array.isArray(response.data) ? response.data : [];

        if (active) {
          setArticles(data.map((item) => normalizeArticle(item as Record<string, unknown>)));
        }
      } catch (err) {
        if (active) {
          const message = axios.isAxiosError(err)
            ? err.response?.data?.error ?? err.response?.data?.message ?? err.message
            : 'Unable to load articles';
          setError(message);
          setArticles([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadArticles();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <Spin size="large" tip="Loading articles from the API..." />;
  }

  if (error) {
    return <Alert className="page-card" type="error" showIcon message="Unable to load articles" description={error} />;
  }

  if (!articles.length) {
    return <div>There is no article available now.</div>;
  }

  return (
    <div className="article-grid">
      <Title level={2}>Latest Articles</Title>
      <Row gutter={[16, 16]} justify="space-around">
        {articles.map((article) => (
          <Col xs={24} sm={12} lg={8} key={article.id}>
            <Card
              className="article-card"
              cover={article.image ? <img alt={article.title} src={article.image} style={{ height: 180, objectFit: 'cover' }} /> : null}
              title={article.title}
              extra={<Tag color="blue">#{article.id}</Tag>}
            >
              <Paragraph>{article.body}</Paragraph>
              <Link to={`/a/${article.id}`}>Details</Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Articles;


