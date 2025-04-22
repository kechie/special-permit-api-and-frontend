import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const PermitForm = () => {
  const [formData, setFormData] = useState({
    applicant_name: '',
    product_or_service: '',
    permit_type: 'peddler',
    application_date: '',
    issue_date: '',
    expiration_date: '',
    status: 'pending',
    business_tax: '0.00',
    peddlers_tax: '181.50',
    mayors_permit_fee: '181.50',
    individual_mayors_permit_fee: '200.00', // Default for 1 employee
    health_certificate: '200.00', // Default for 1 employee
    laboratory: '375.00',
    sanitary_permit: '150.00',
    garbage_fee: '150.00',
    sticker_fee: '50.00',
    number_of_employees: '1', // Default to 1
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Determine API URL based on environment
  const API_BASE_URL =
    import.meta.env.VITE_NODE_ENV === 'production'
      ? import.meta.env.VITE_BASE_API_URL_PROD
      : import.meta.env.VITE_NODE_ENV === 'test'
        ? import.meta.env.VITE_BASE_API_URL_TEST
        : import.meta.env.VITE_BASE_API_URL_DEV;

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
            peddlers_tax: parseFloat(response.data.peddlers_tax || 181.50).toFixed(2),
            mayors_permit_fee: parseFloat(response.data.mayors_permit_fee || 181.50).toFixed(2),
            individual_mayors_permit_fee: parseFloat(response.data.individual_mayors_permit_fee || 200.00).toFixed(2),
            health_certificate: parseFloat(response.data.health_certificate || 200.00).toFixed(2),
            laboratory: parseFloat(response.data.laboratory || 0).toFixed(2),
            sanitary_permit: parseFloat(response.data.sanitary_permit || 150.00).toFixed(2),
            garbage_fee: parseFloat(response.data.garbage_fee || 150.00).toFixed(2),
            sticker_fee: parseFloat(response.data.sticker_fee || 50.00).toFixed(2),
            number_of_employees: response.data.number_of_employees?.toString() || '1',
          };
          setFormData(formattedData);
        } catch (error) {
          setError(error.message || 'Error fetching permit');
          console.error('Error fetching permit', error);
        }
      };
      fetchPermit();
    }
  }, [id, API_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'permit_type') {
      if (value === 'peddler') {
        setFormData({
          ...formData,
          permit_type: value,
          business_tax: '0.00',
          peddlers_tax: '181.50',
          mayors_permit_fee: '181.50',
          individual_mayors_permit_fee: '200.00', // Fixed at 1 employee
          health_certificate: '200.00', // Fixed at 1 employee
          sanitary_permit: '150.00',
          garbage_fee: '150.00',
          sticker_fee: '50.00',
          number_of_employees: '1', // Force to 1 for peddler
        });
      } else {
        setFormData({
          ...formData,
          permit_type: value,
          peddlers_tax: '0.00',
          mayors_permit_fee: '0.00',
          individual_mayors_permit_fee: '0.00',
          health_certificate: '0.00',
          sanitary_permit: '0.00',
          garbage_fee: '0.00',
          sticker_fee: '0.00',
          number_of_employees: '1', // Reset for special, can be edited
        });
      }
    } else if (name === 'number_of_employees' && formData.permit_type !== 'peddler') {
      const employees = parseInt(value) || 1;
      setFormData({
        ...formData,
        number_of_employees: value,
        individual_mayors_permit_fee: (employees * 200).toFixed(2),
        health_certificate: (employees * 200).toFixed(2),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

    if (!formData.applicant_name || !formData.permit_type || !formData.application_date) {
      setError('All required fields must be filled');
      setLoading(false);
      return;
    }

    if (parseInt(formData.number_of_employees) < 1) {
      setError('Number of employees must be at least 1');
      setLoading(false);
      return;
    }

    const submitData = {
      ...formData,
      business_tax: parseFloat(formData.business_tax) || 0,
      peddlers_tax: parseFloat(formData.peddlers_tax) || 0,
      mayors_permit_fee: parseFloat(formData.mayors_permit_fee) || 0,
      individual_mayors_permit_fee: parseFloat(formData.individual_mayors_permit_fee) || 0,
      health_certificate: parseFloat(formData.health_certificate) || 0,
      laboratory: parseFloat(formData.laboratory) || 0,
      sanitary_permit: parseFloat(formData.sanitary_permit) || 0,
      garbage_fee: parseFloat(formData.garbage_fee) || 0,
      sticker_fee: parseFloat(formData.sticker_fee) || 0,
      number_of_employees: parseInt(formData.number_of_employees) || 1,
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

  const handleCancel = () => {
    navigate('/permits');
  };

  const isPeddler = formData.permit_type === 'peddler';

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
            <Form.Group controlId="number_of_employees" className="mb-3">
              <Form.Label>Number of Employees *</Form.Label>
              <Form.Control
                type="number"
                min="1"
                name="number_of_employees"
                value={formData.number_of_employees}
                onChange={handleChange}
                required
                disabled={loading || isPeddler}
              />
            </Form.Group>
          </Col>
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
                disabled={loading || isPeddler}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="peddlers_tax" className="mb-3">
              <Form.Label>Peddlers Tax</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="peddlers_tax"
                value={formData.peddlers_tax}
                onChange={handleChange}
                disabled={loading || isPeddler}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
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
                disabled={loading || isPeddler}
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
                disabled={loading || isPeddler}
                readOnly
              />
            </Form.Group>
          </Col>
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
                disabled={loading || isPeddler}
                readOnly
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
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
                disabled={loading || isPeddler}
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
                disabled={loading || isPeddler}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="garbage_fee" className="mb-3">
              <Form.Label>Garbage Fee</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="garbage_fee"
                value={formData.garbage_fee}
                onChange={handleChange}
                disabled={loading || isPeddler}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group controlId="sticker_fee" className="mb-3">
              <Form.Label>Sticker Fee</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                name="sticker_fee"
                value={formData.sticker_fee}
                onChange={handleChange}
                disabled={loading || isPeddler}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : isEdit ? 'Update Permit' : 'Save Permit'}
          </Button>
          <Button variant="secondary" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PermitForm;