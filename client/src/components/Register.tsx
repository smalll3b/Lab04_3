import React from 'react';
import axios from 'axios';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { api } from '../common/http-common';

const { Paragraph, Title } = Typography;
const { TextArea } = Input;

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      setSubmitting(true);
      await axios.post(`${api.uri}/users`, values);
      message.success('Registration successful. Please log in.');
      form.resetFields();
      navigate('/login');
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.err ?? error.response?.data?.error ?? error.message
        : 'Unable to register the account';
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="page-card" title="Register">
      <Title level={2}>Create an account</Title>
      <Paragraph type="secondary">This form sends a new user record to the backend API.</Paragraph>
      <Form
        form={form}
        layout="vertical"
        scrollToFirstError
        onFinish={handleSubmit}
        initialValues={{ about: '' }}
      >
        <Form.Item label="First name" name="firstName" rules={[{ required: true, message: 'Please input your first name' }]}>
          <Input placeholder="First name" />
        </Form.Item>
        <Form.Item label="Last name" name="lastName" rules={[{ required: true, message: 'Please input your last name' }]}>
          <Input placeholder="Last name" />
        </Form.Item>
        <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input a username' }, { min: 3, message: 'Username must be at least 3 characters' }]}>
          <Input placeholder="Choose a username" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid email address' }]}>
          <Input placeholder="name@example.com" />
        </Form.Item>
        <Form.Item label="Avatar URL" name="avatarURL" rules={[{ type: 'url', message: 'Please input a valid URL' }]}>
          <Input placeholder="https://example.com/avatar.jpg" />
        </Form.Item>
        <Form.Item label="About" name="about">
          <TextArea rows={4} placeholder="Tell us something about you" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input a password' }, { min: 6, message: 'Password must be at least 6 characters' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={submitting}>
          Register
        </Button>
      </Form>
    </Card>
  );
};

export default Register;


