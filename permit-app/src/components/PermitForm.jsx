// src/components/PermitForm.jsx
import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const PermitForm = () => {
  const [formData, setFormData] = useState({
    applicant_name: '',
    permit_type: 'peddler',
    issue_date: '',
    expiration_date: '',
    status: 'pending',
    business_tax: 0.00,
    mayors_permit_fee: 0.00,
    individual_mayors_permit_fee: 0.00,
    health_certificate: 0.00,
    laboratory: 0.00,
    sanitary_permit: 0.00,
    garbage_fee: 0.00,
    sticker_fee: 0.00
  })

  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const { id } = useParams()  // Retrieve the permit ID for editing
  const navigate = useNavigate() // Use navigate instead of history

  // Fetch the permit details if it's an edit action
  useEffect(() => {
    if (id) {
      setIsEdit(true)
      const fetchPermit = async () => {
        try {
          const token = localStorage.getItem('token')
          const response = await axios.get(`http://localhost:5000/api/permits/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          setFormData(response.data)
        } catch (error) {
          console.error('Error fetching permit', error)
        }
      }
      fetchPermit()
    }
  }, [id])

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Submit the form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const token = localStorage.getItem('token')

    try {
      if (isEdit) {
        // Update the permit if it's in edit mode
        await axios.put(`http://localhost:5000/api/permits/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        // Create a new permit
        await axios.post('http://localhost:5000/api/permits', formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }

      setLoading(false)
      navigate('/permits')  // Redirect to the permits list after submission
    } catch (error) {
      setLoading(false)
      console.error('Error submitting permit', error)
    }
  }

  return (
    <div>
      <h3>{isEdit ? 'Edit Permit' : 'Create Permit'}</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="applicant_name">
          <Form.Label>Applicant Name</Form.Label>
          <Form.Control
            type="text"
            name="applicant_name"
            value={formData.applicant_name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="permit_type">
          <Form.Label>Permit Type</Form.Label>
          <Form.Control
            as="select"
            name="permit_type"
            value={formData.permit_type}
            onChange={handleChange}
            required
          >
            <option value="peddler">Peddler</option>
            <option value="special">Special</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="issue_date">
          <Form.Label>Issue Date</Form.Label>
          <Form.Control
            type="date"
            name="issue_date"
            value={formData.issue_date}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="expiration_date">
          <Form.Label>Expiration Date</Form.Label>
          <Form.Control
            type="date"
            name="expiration_date"
            value={formData.expiration_date}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="status">
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="business_tax">
          <Form.Label>Business Tax</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="business_tax"
            value={formData.business_tax}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="mayors_permit_fee">
          <Form.Label>Mayor's Permit Fee</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="mayors_permit_fee"
            value={formData.mayors_permit_fee}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="individual_mayors_permit_fee">
          <Form.Label>Individual Mayor's Permit Fee</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="individual_mayors_permit_fee"
            value={formData.individual_mayors_permit_fee}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="health_certificate">
          <Form.Label>Health Certificate</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="health_certificate"
            value={formData.health_certificate}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="laboratory">
          <Form.Label>Laboratory</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="laboratory"
            value={formData.laboratory}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="sanitary_permit">
          <Form.Label>Sanitary Permit</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="sanitary_permit"
            value={formData.sanitary_permit}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="garbage_fee">
          <Form.Label>Garbage Fee</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="garbage_fee"
            value={formData.garbage_fee}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="sticker_fee">
          <Form.Label>Sticker Fee</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="sticker_fee"
            value={formData.sticker_fee}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : isEdit ? 'Update Permit' : 'Create Permit'}
        </Button>
      </Form>
    </div>
  )
}

export default PermitForm
