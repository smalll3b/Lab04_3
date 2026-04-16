import React from 'react';
import { Card, Typography } from 'antd';
import Articles from './Articles';
import Hello from './Hello';

const { Paragraph, Title } = Typography;

const Home = () => (
  <>
    <section className="hero-banner">
      <Title level={1}>Blog homepage</Title>
      <Paragraph>
        This Lab 9 SPA loads articles from the Koa backend API and supports authenticated requests.
      </Paragraph>
    </section>

    <Card className="page-card" title="Welcome component demo">
      <Hello />
    </Card>

    <Articles />
  </>
);

export default Home;


