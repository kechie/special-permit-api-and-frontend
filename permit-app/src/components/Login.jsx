// src/components/Login.jsx
import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
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
    <div>
      <h3>Login</h3>
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
    </div>
  )
}

export default Login
