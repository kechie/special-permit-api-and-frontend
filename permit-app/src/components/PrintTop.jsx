// src/components/PrintTop.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const PrintTop = () => {
  const { id } = useParams()
  const [permit, setPermit] = useState(null)

  useEffect(() => {
    const fetchPermit = async () => {
      const token = localStorage.getItem('spclpermittoken')
      const response = await axios.get(`http://localhost:3021/api/permits/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPermit(response.data)
    }

    fetchPermit()
  }, [id])

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
      <p><strong>Permit Type:</strong> {permit.permit_type}</p>
      <p><strong>Business Tax:</strong> ₱{permit.business_tax}</p>
      <p><strong>Mayor's Permit Fee:</strong> ₱{permit.mayors_permit_fee}</p>
      <p><strong>Individual Mayor's Permit Fee:</strong> ₱{permit.individual_mayors_permit_fee}</p>
      <p><strong>Health Certificate:</strong> ₱{permit.health_certificate}</p>
      <p><strong>Laboratory:</strong> ₱{permit.laboratory}</p>
      <p><strong>Sanitary Permit:</strong> ₱{permit.sanitary_permit}</p>
      <p><strong>Garbage Fee:</strong> ₱{permit.garbage_fee}</p>
      <p><strong>Sticker Fee:</strong> ₱{permit.sticker_fee}</p>
    </div>
  )
}

export default PrintTop