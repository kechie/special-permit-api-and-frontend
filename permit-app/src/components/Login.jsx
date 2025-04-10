// src/components/Login.jsx
import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const API_BASE_URL = 'http://localhost:3021/api'
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      //const response = await axios.post('http://localhost:5000/api/auth/login', { email, password })
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password })
      localStorage.setItem('token', response.data.token) // Save the token
      navigate('/permits')
    } catch (err) {
      setError('Invalid credentials', err)
    }
  }

  return (
    <div className="col-md-6 offset-md-3">
      <h3>Login</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">Login</Button>
      </Form>
    </div>
  )
}

export default Login
