// src/components/Login.jsx
import React, { useState } from 'react'
import { Container, Card, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const API_BASE_URL = 'http://localhost:3021/api'

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password })
      const { token } = response.data
      login(token)
      navigate('/permits') // Redirect to permits after login
    } catch (err) {
      setError('Invalid credentials:', err)
    }
  }

  return (
    <Container className="vh-100 d-flex align-items-center justify-content-center">
      <Card style={{ width: '400px' }} className="shadow-sm">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold">PNPCNL COOP</h2>
            <p className="text-muted">Login to your account</p>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Button type="submit">Login</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Login
