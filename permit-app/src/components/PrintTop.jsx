// src/components/PrintTop.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const PrintTop = () => {
  const { id } = useParams()
  const [permit, setPermit] = useState(null)
  //const API_BASE_URL = 'http://localhost:3021/api';
  // Determine API URL based on environment
  const API_BASE_URL =
    import.meta.env.VITE_NODE_ENV === 'production'
      ? import.meta.env.VITE_BASE_API_URL_PROD
      : import.meta.env.VITE_NODE_ENV === 'test'
        ? import.meta.env.VITE_BASE_API_URL_TEST
        : import.meta.env.VITE_BASE_API_URL_DEV;

  useEffect(() => {
    const fetchPermit = async () => {
      const token = localStorage.getItem('spclpermittoken')
      const response = await axios.get(`${API_BASE_URL}/api/permits/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPermit(response.data)
    }

    fetchPermit()
  }, [id, API_BASE_URL])

  useEffect(() => {
    if (permit) {
      window.print()
    }
  }, [permit])

  if (!permit) return <p>Loading...</p>

  return (
    <div className="container mt-5">
      <h2>Tax Order of Payment</h2>
      <p><strong>Applicant:</strong> {permit.applicant_name}</p>
      <p><strong>Product/Service:</strong>{permit.product_or_service}</p>
      <p><strong>Permit Type:</strong> {permit.permit_type}</p>
      <p><strong>Business Tax:</strong> ₱{permit.business_tax}</p>
      <p><strong>Mayor's Permit Fee:</strong> ₱{permit.mayors_permit_fee}</p>
      <p><strong>Individual Mayor's Permit Fee:</strong> ₱{permit.individual_mayors_permit_fee}</p>
      <p><strong>Health Certificate:</strong> ₱{permit.health_certificate}</p>
      <p><strong>Laboratory:</strong> ₱{permit.laboratory}</p>
      <p><strong>Sanitary Permit:</strong> ₱{permit.sanitary_permit}</p>
      <p><strong>Garbage Fee:</strong> ₱{permit.garbage_fee}</p>
      <p><strong>Sticker Fee:</strong> ₱{permit.sticker_fee}</p>
      <hr />
      <p><strong>Amount Due:</strong>₱{permit.amount_due}</p>
    </div>
  )
}

export default PrintTop