import React from 'react';
import { Card, Typography } from 'antd';

const { Paragraph, Title } = Typography;

const About = () => (
  <Card className="page-card" title="About this SPA">
    <Title level={2}>React learning page</Title>
    <Paragraph>
      This page demonstrates routing, reusable components, props, state, and simple Ant Design layout.
    </Paragraph>
    <Paragraph>
      It matches the Lab 8 requirement for placeholder pages and SPA navigation.
    </Paragraph>
  </Card>
);

export default About;

