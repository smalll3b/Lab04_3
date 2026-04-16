import React from 'react';
import { Button, Layout, Menu, Space, Typography } from 'antd';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import About from './components/About';
import Register from './components/Register';
import Login from './components/Login';
import ArticleDetail from './components/ArticleDetail';
import { clearAuthSession, loadAuthSession, onAuthChanged } from './common/auth';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const navItems = [
  { key: 'home', label: <Link to="/">Home</Link> },
  { key: 'dashboard', label: <Link to="/dashboard">Dashboard</Link> },
  { key: 'about', label: <Link to="/about">About</Link> },
  { key: 'register', label: <Link to="/register">Register</Link> },
  { key: 'login', label: <Link to="/login">Login</Link> },
];

const App = () => {
  const [session, setSession] = React.useState(loadAuthSession());

  React.useEffect(() => onAuthChanged(() => setSession(loadAuthSession())), []);

  const handleLogout = () => {
    clearAuthSession();
    setSession(null);
  };

  return (
    <BrowserRouter>
      <Layout className="app-shell">
        <Header className="app-header">
          <div className="brand-block">
            <Title level={3} className="brand-title">Blog SPA</Title>
            <Text className="brand-subtitle">Lab 9 · React + API + Basic Auth</Text>
          </div>
          <Menu theme="dark" mode="horizontal" items={navItems} selectable={false} className="nav-menu" />
          <Space className="auth-block">
            <Text className="auth-status">
              {session ? `Signed in as ${session.username}` : 'Not signed in'}
            </Text>
            {session ? (
              <Button onClick={handleLogout}>Logout</Button>
            ) : null}
          </Space>
        </Header>

        <Content className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/a/:aid" element={<ArticleDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>

        <Footer className="app-footer">
          <Space direction="vertical" size={0}>
            <Text strong>VT6003CEM Demo SPA</Text>
            <Text type="secondary">Connected to the Koa API for Lab 9</Text>
          </Space>
        </Footer>
      </Layout>
    </BrowserRouter>
  );
};

export default App;


