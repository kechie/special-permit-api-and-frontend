import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PrintTop = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [permit, setPermit] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermit = async () => {
      const token = localStorage.getItem('spclpermittoken');
      if (!token || !isAuthenticated) {
        setError('Please log in to view this permit');
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3021/api/permits/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPermit(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          setTimeout(() => navigate('/login'), 2000);
        } else if (err.response?.status === 404) {
          setError('Permit not found.');
        } else {
          setError(err.response?.data?.message || 'Error fetching permit.');
        }
        console.error('Error fetching permit:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPermit();
  }, [id, isAuthenticated, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  if (!permit) {
    return (
      <div className="container mt-5">
        <p>No permit data available.</p>
      </div>
    );
  }

  return (
    <Card className="container mt-5 mb-3">
      <Card.Header>Tax Order of Payment</Card.Header>
      <Card.Body>
        <p><strong>Applicant:</strong> {permit.applicant_name}</p>
        <p><strong>Permit Type:</strong> {permit.permit_type}</p>
        <p><strong>Business Tax:</strong> ₱{parseFloat(permit.business_tax).toFixed(2)}</p>
        <p><strong>Mayor's Permit Fee:</strong> ₱{parseFloat(permit.mayors_permit_fee).toFixed(2)}</p>
        <p><strong>Individual Mayor's Permit Fee:</strong> ₱{parseFloat(permit.individual_mayors_permit_fee).toFixed(2)}</p>
        <p><strong>Health Certificate:</strong> ₱{parseFloat(permit.health_certificate).toFixed(2)}</p>
        <p><strong>Laboratory:</strong> ₱{parseFloat(permit.laboratory).toFixed(2)}</p>
        <p><strong>Sanitary Permit:</strong> ₱{parseFloat(permit.sanitary_permit).toFixed(2)}</p>
        <p><strong>Garbage Fee:</strong> ₱{parseFloat(permit.garbage_fee).toFixed(2)}</p>
        <p><strong>Sticker Fee:</strong> ₱{parseFloat(permit.sticker_fee).toFixed(2)}</p>
        <Button variant="primary" onClick={handlePrint}>
          Print Document
        </Button>
      </Card.Body>
    </Card>
  );
};

export default PrintTop;