// src/components/PermitForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const PermitForm = () => {
  const [formData, setFormData] = useState({
    applicant_name: '',
    permit_type: 'peddler',
    application_date: '', // Added
    issue_date: '',
    expiration_date: '',
    status: 'pending',
    business_tax: '0.00',
    mayors_permit_fee: '0.00',
    individual_mayors_permit_fee: '0.00',
    health_certificate: '0.00',
    laboratory: '0.00',
    sanitary_permit: '0.00',
    garbage_fee: '0.00',
    sticker_fee: '0.00',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:3021/api';

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      const fetchPermit = async () => {
        try {
          const token = localStorage.getItem('spclpermittoken');
          if (!token) throw new Error('No authentication token found');
          const response = await axios.get(`${API_BASE_URL}/permits/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const formattedData = {
            ...response.data,
            application_date: response.data.application_date?.slice(0, 10) || '',
            issue_date: response.data.issue_date?.slice(0, 10) || '',
            expiration_date: response.data.expiration_date?.slice(0, 10) || '',
            business_tax: parseFloat(response.data.business_tax || 0).toFixed(2),
            mayors_permit_fee: parseFloat(response.data.mayors_permit_fee || 0).toFixed(2),
            individual_mayors_permit_fee: parseFloat(response.data.individual_mayors_permit_fee || 0).toFixed(2),
            health_certificate: parseFloat(response.data.health_certificate || 0).toFixed(2),
            laboratory: parseFloat(response.data.laboratory || 0).toFixed(2),
            sanitary_permit: parseFloat(response.data.sanitary_permit || 0).toFixed(2),
            garbage_fee: parseFloat(response.data.garbage_fee || 0).toFixed(2),
            sticker_fee: parseFloat(response.data.sticker_fee || 0).toFixed(2),
          };
          setFormData(formattedData);
        } catch (error) {
          setError(error.message || 'Error fetching permit');
          console.error('Error fetching permit', error);
        }
      };
      fetchPermit();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('spclpermittoken');
    if (!token) {
      setError('Please log in to submit the form');
      setLoading(false);
      return;
    }
    //"{"applicant_name":"Johnny Smith","permit_type":"peddler","application_date":"2025-01-01","issue_date":"","expiration_date":"","status":"pending","business_tax":0,"mayors_permit_fee":0,"individual_mayors_permit_fee":0,"health_certificate":0,"laboratory":0,"sanitary_permit":0,"garbage_fee":0,"sticker_fee":0}"
    // Validate required fields
    if (!formData.applicant_name || !formData.permit_type || !formData.application_date) {
      setError('All required fields must be filled');
      setLoading(false);
      return;
    }

    // Format numeric fields
    const submitData = {
      ...formData,
      business_tax: parseFloat(formData.business_tax) || 0,
      mayors_permit_fee: parseFloat(formData.mayors_permit_fee) || 0,
      individual_mayors_permit_fee: parseFloat(formData.individual_mayors_permit_fee) || 0,
      health_certificate: parseFloat(formData.health_certificate) || 0,
      laboratory: parseFloat(formData.laboratory) || 0,
      sanitary_permit: parseFloat(formData.sanitary_permit) || 0,
      garbage_fee: parseFloat(formData.garbage_fee) || 0,
      sticker_fee: parseFloat(formData.sticker_fee) || 0,
    };

    try {
      if (isEdit) {
        await axios.put(`${API_BASE_URL}/permits/${id}`, submitData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_BASE_URL}/permits`, submitData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/permits');
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting permit');
      console.error('Error submitting permit', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-3">
      <h3>{isEdit ? 'Edit Permit' : 'Create Permit'}</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="applicant_name" className="mb-3">
              <Form.Label>Applicant Name *</Form.Label>
              <Form.Control
                type="text"
                name="applicant_name"
                value={formData.applicant_name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="permit_type" className="mb-3">
              <Form.Label>Permit Type *</Form.Label>
              <Form.Control
                as="select"
                name="permit_type"
                value={formData.permit_type}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="peddler">Peddler</option>
                <option value="special">Special</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group controlId="application_date" className="mb-3">
              <Form.Label>Application Date *</Form.Label>
              <Form.Control
                type="date"
                name="application_date"
                value={formData.application_date}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="issue_date" className="mb-3">
              <Form.Label>Issue Date</Form.Label>
              <Form.Control
                type="date"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleChange}
                disabled={loading}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="expiration_date" className="mb-3">
              <Form.Label>Expiration Date</Form.Label>
              <Form.Control
                type="date"
                name="expiration_date"
                value={formData.expiration_date}
                onChange={handleChange}
                disabled={loading}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="status" className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Form.Control>
        </Form.Group>

        <Row>
          <Col md={4}>
            <Form.Group controlId="business_tax" className="mb-3">
              <Form.Label>Business Tax</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="business_tax"
                value={formData.business_tax}
                onChange={handleChange}
                disabled={loading}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="mayors_permit_fee" className="mb-3">
              <Form.Label>Mayor's Permit Fee</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="mayors_permit_fee"
                value={formData.mayors_permit_fee}
                onChange={handleChange}
                disabled={loading}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="individual_mayors_permit_fee" className="mb-3">
              <Form.Label>Individual Mayor's Permit Fee</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="individual_mayors_permit_fee"
                value={formData.individual_mayors_permit_fee}
                onChange={handleChange}
                disabled={loading}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group controlId="health_certificate" className="mb-3">
              <Form.Label>Health Certificate</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="health_certificate"
                value={formData.health_certificate}
                onChange={handleChange}
                disabled={loading}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="laboratory" className="mb-3">
              <Form.Label>Laboratory</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="laboratory"
                value={formData.laboratory}
                onChange={handleChange}
                disabled={loading}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="sanitary_permit" className="mb-3">
              <Form.Label>Sanitary Permit</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="sanitary_permit"
                value={formData.sanitary_permit}
                onChange={handleChange}
                disabled={loading}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="garbage_fee" className="mb-3">
              <Form.Label>Garbage Fee</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="garbage_fee"
                value={formData.garbage_fee}
                onChange={handleChange}
                disabled={loading}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="sticker_fee" className="mb-3">
              <Form.Label>Sticker Fee</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="sticker_fee"
                value={formData.sticker_fee}
                onChange={handleChange}
                disabled={loading}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : isEdit ? 'Update Permit' : 'Create Permit'}
        </Button>
      </Form>
    </div>
  );
};

export default PermitForm;
/*
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
  const { id } = useParams()
  const navigate = useNavigate()

  const API_BASE_URL = 'http://localhost:3021/api'

  useEffect(() => {
    if (id) {
      setIsEdit(true)
      const fetchPermit = async () => {
        try {
          const token = localStorage.getItem('spclpermittoken')
          const response = await axios.get(`${API_BASE_URL}/permits/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const formattedData = {
            ...response.data,
            issue_date: response.data.issue_date?.slice(0, 10),
            expiration_date: response.data.expiration_date?.slice(0, 10),
          }
          setFormData(formattedData)
        } catch (error) {
          console.error('Error fetching permit', error)
        }
      }
      fetchPermit()
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const token = localStorage.getItem('spclpermittoken')

    try {
      if (isEdit) {
        await axios.put(`${API_BASE_URL}/permits/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post(`${API_BASE_URL}/permits/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }

      setLoading(false)
      navigate('/permits')
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
 */