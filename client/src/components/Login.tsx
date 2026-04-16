import React from 'react';
import axios from 'axios';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { api } from '../common/http-common';
import { buildBasicAuthHeader, saveAuthSession } from '../common/auth';

const { Paragraph, Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      setSubmitting(true);
      const response = await axios.post(`${api.uri}/users/login`, values);
      const token = buildBasicAuthHeader(values.username, values.password).replace(/^Basic\s+/i, '');
      saveAuthSession({ username: response.data?.username ?? values.username, token });
      message.success('Login successful');
      form.resetFields(['password']);
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error ?? error.response?.data?.message ?? error.message
        : 'Unable to login';
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="page-card" title="Login">
      <Title level={2}>Sign in</Title>
      <Paragraph type="secondary">This form authenticates with the backend and stores a Basic Auth session.</Paragraph>
      <Form form={form} layout="vertical" scrollToFirstError onFinish={handleSubmit}>
        <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username' }]}>
          <Input placeholder="Your username" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={submitting}>
          Login
        </Button>
      </Form>
    </Card>
  );
};

export default Login;


