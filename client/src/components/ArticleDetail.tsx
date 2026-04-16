import React from 'react';
import axios from 'axios';
import { Alert, Button, Card, Empty, Spin, Typography } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../common/http-common';
import { normalizeArticle, type NormalizedArticle } from '../common/article';

const { Paragraph, Title, Text } = Typography;

const ArticleDetail = () => {
  const { aid } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = React.useState<NormalizedArticle | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;

    const loadArticle = async () => {
      if (!aid) {
        setLoading(false);
        setError('Missing article identifier');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${api.uri}/articles/${aid}`);

        if (active) {
          setArticle(normalizeArticle(response.data as Record<string, unknown>));
        }
      } catch (err) {
        if (active) {
          const message = axios.isAxiosError(err)
            ? err.response?.data?.error ?? err.response?.data?.message ?? err.message
            : 'Unable to load article';
          setError(message);
          setArticle(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadArticle();

    return () => {
      active = false;
    };
  }, [aid]);

  if (loading) {
    return <Spin size="large" tip="Loading article details..." />;
  }

  if (error) {
    return <Alert className="page-card" type="error" showIcon message="Unable to load article" description={error} />;
  }

  if (!article) {
    return (
      <Card className="page-card">
        <Empty description="Article not found" />
        <div className="detail-actions">
          <Button icon={<RollbackOutlined />} onClick={() => navigate(-1)}>
            Go back
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="page-card"
      cover={article.image ? <img alt={article.title} src={article.image} style={{ maxHeight: 320, objectFit: 'cover' }} /> : null}
    >
      <Title level={2}>{article.title}</Title>
      <Paragraph>{article.body}</Paragraph>
      <Text type="secondary">Article ID: {article.id}</Text>
      <div className="detail-actions">
        <Button type="primary" icon={<RollbackOutlined />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </Card>
  );
};

export default ArticleDetail;


