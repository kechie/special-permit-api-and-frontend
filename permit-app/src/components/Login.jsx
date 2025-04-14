import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:3021/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      if (!response.data.token) {
        throw new Error('No token received from server');
      }
      login(response.data.token);
      navigate('/permits');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setEmail('');
    setPassword('');
    navigate('/');
  };

  if (isAuthenticated) {
    return (
      <Card style={{ width: '36rem' }} className="mb-3 mx-auto">
        <Card.Header>Special Permit Management</Card.Header>
        <Card.Body>
          <Card.Title>You are logged in</Card.Title>
          <p>Would you like to log out?</p>
          <Button variant="danger" onClick={handleLogout} disabled={loading}>
            Logout
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-3">
      <Card.Header>Special Permit Management Login</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Login;