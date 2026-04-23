import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Button, Card, DatePicker, Row, Col, Statistic, Typography, Spin } from 'antd';
import type { DatePickerProps } from 'antd';
import { ArrowRightOutlined, ThunderboltOutlined } from '@ant-design/icons';
import Hello from './Hello';
import Goodbye from './Goodbye';
import { api } from '../common/http-common';
import { getAuthHeaders, loadAuthSession, onAuthChanged } from '../common/auth';

const { Paragraph, Title } = Typography;

let counter = 0;

const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};

const Dashboard = () => {
  const [clicks, setClicks] = useState(0);
  const [privateMessage, setPrivateMessage] = useState<string>('');
  const [privateError, setPrivateError] = useState<string | null>(null);
  const [loadingPrivate, setLoadingPrivate] = useState(true);
  const [session, setSession] = useState(loadAuthSession());

  const onPrimaryClick = () => {
    console.log(counter++);
    setClicks((value) => value + 1);
  };

  const onDangerClick = () => {
      console.log(counter--);
    setClicks((value) => value - 1);
  };

  React.useEffect(() => onAuthChanged(() => setSession(loadAuthSession())), []);

  React.useEffect(() => {
    let active = true;

    const loadPrivateMessage = async () => {
      const currentSession = loadAuthSession();
      setSession(currentSession);

      if (!currentSession) {
        if (active) {
          setPrivateMessage('Please log in to view the protected API message.');
          setPrivateError(null);
          setLoadingPrivate(false);
        }
        return;
      }

      try {
        setLoadingPrivate(true);
        setPrivateError(null);
        const response = await axios.get(`${api.uri}/private`, {
          headers: getAuthHeaders(),
        });

        if (active) {
          setPrivateMessage(response.data?.message ?? 'Protected resource loaded');
        }
      } catch (error) {
        if (active) {
          const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.message ?? error.response?.data?.error ?? error.message
            : 'Unable to load protected content';
          setPrivateError(errorMessage);
          setPrivateMessage('');
        }
      } finally {
        if (active) {
          setLoadingPrivate(false);
        }
      }
    };

    loadPrivateMessage();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Card className="page-card" title="Ant Design / React demo">
        <Hello name="Web API Development" />
        <Goodbye name="everyone" />
        <Paragraph>
          This page demonstrates props, state, events, and a protected API call using Basic Auth.
        </Paragraph>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Statistic title="Blue button clicks" value={clicks} prefix={<ThunderboltOutlined />} />
          </Col>
          <Col xs={24} md={16}>
            <DatePicker onChange={onChange} />
          </Col>
        </Row>
        <div className="demo-actions">
          <Button type="primary" icon={<ArrowRightOutlined />} onClick={onPrimaryClick}>
            Primary button
          </Button>
          <Button type="primary" danger onClick={onDangerClick}>
            Danger button
          </Button>
        </div>
      </Card>

      <Card className="page-card" title="Protected API status">
        {loadingPrivate ? <Spin tip="Loading protected endpoint..." /> : null}
        {!loadingPrivate && privateMessage ? <Alert type="success" showIcon message={privateMessage} /> : null}
        {!loadingPrivate && privateError ? <Alert type="error" showIcon message={privateError} /> : null}
        {!loadingPrivate && !session ? (
          <Alert type="warning" showIcon message="No login session found. Please log in first." />
        ) : null}
      </Card>
    </>
  );
};

export default Dashboard;

