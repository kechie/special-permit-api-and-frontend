// src/components/Register.jsx
import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const API_BASE_URL =
    import.meta.env.VITE_NODE_ENV === 'production'
      ? import.meta.env.VITE_BASE_API_URL_PROD
      : import.meta.env.VITE_NODE_ENV === 'test'
        ? import.meta.env.VITE_BASE_API_URL_TEST
        : import.meta.env.VITE_BASE_API_URL_DEV;

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      //const response = await axios.post('http://localhost:5000/api/auth/register', { email, password, username })
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, { email, password, username })
      localStorage.setItem('token', response.data.token) // Save the token
      navigate('/permits')
    } catch (err) {
      setError('Error registering user:', err)
    }
  }

  return (
    <div className="col-md-6 offset-md-3">
      <h3>Register</h3>
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
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <Button variant="primary" type="submit">Register</Button>
      </Form>
    </div>
  )
}

export default Register
