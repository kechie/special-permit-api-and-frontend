// src/components/PermitStatus.jsx
// This component fetches and displays the status of a special permit based on the ID provided in the URL. 
// It handles loading, error, and success states, and displays relevant information about the permit.
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Alert, Spinner } from 'react-bootstrap'
// Add this helper function at the top of the file after imports
const isPermitValid = (permit) => {
  if (!permit.amount_paid || !permit.or_number || !permit.expiration_date) {
    return false;
  }
  const today = new Date();
  const expirationDate = new Date(permit.expiration_date);
  return expirationDate >= today;
};
const PermitStatus = () => {
  const { id } = useParams()
  const [permit, setPermit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusCode, setStatusCode] = useState(null)

  const API_BASE_URL =
    import.meta.env.VITE_NODE_ENV === 'production'
      ? import.meta.env.VITE_BASE_API_URL_PROD
      : import.meta.env.VITE_NODE_ENV === 'test'
        ? import.meta.env.VITE_BASE_API_URL_TEST
        : import.meta.env.VITE_BASE_API_URL_DEV;

  useEffect(() => {
    const fetchPermit = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get(`${API_BASE_URL}/permits/noauth/${id}`)
        setStatusCode(response.status)
        setPermit(response.data)
      } catch (err) {
        setStatusCode(err.response?.status)
        setError(
          err.response?.status === 404
            ? 'Permit not found'
            : err.response?.status === 500
              ? 'Server error occurred'
              : err.message || 'Error fetching permit'
        )
        console.error('Error fetching permit:', {
          status: err.response?.status,
          message: err.message,
          data: err.response?.data
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPermit()
  }, [id, API_BASE_URL])

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error {statusCode}</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </div>
    )
  }

  // Replace the return section with this updated version
  return (
    <div className="container mt-5">
      {statusCode === 200 && (
        <Alert variant="success" className="mb-4">
          <Alert.Heading>Permit Status Retrieved Successfully</Alert.Heading>
          <p>Status Code: {statusCode}</p>
        </Alert>
      )}

      <h2 align="center">
        Your Special Permit is {
          !permit.amount_paid || !permit.or_number
            ? "Unpaid"
            : isPermitValid(permit)
              ? "Valid"
              : "Expired"
        }
      </h2>

      <div className="mt-4">
        <Alert
          variant={
            !permit.amount_paid || !permit.or_number
              ? "warning"
              : isPermitValid(permit)
                ? "success"
                : "danger"
          }
        >
          <p>
            <strong>Status:</strong> {
              !permit.amount_paid || !permit.or_number
                ? "PENDING PAYMENT"
                : isPermitValid(permit)
                  ? "VALID"
                  : "EXPIRED"
            }
          </p>
          {/*           <p><strong>Applicant:</strong> {permit.applicant_name}</p> */}
          <p><strong>Permit Type:</strong> {permit.permit_type}</p>
          <p><strong>Issue Date:</strong> {permit.issue_date ? new Date(permit.issue_date).toLocaleDateString() : 'Pending'}</p>
          <p><strong>Expiration Date:</strong> {permit.expiration_date ? new Date(permit.expiration_date).toLocaleDateString() : 'Pending'}</p>
          {isPermitValid(permit) && (
            <p><strong>Days Until Expiration:</strong> {
              Math.ceil((new Date(permit.expiration_date) - new Date()) / (1000 * 60 * 60 * 24))
            } days</p>
          )}
        </Alert>
      </div>
    </div>
  );
}

export default PermitStatus