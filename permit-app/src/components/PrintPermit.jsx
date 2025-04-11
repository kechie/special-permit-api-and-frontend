// src/components/PrintPermit.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const PrintPermit = () => {
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
      <h2>Official Permit</h2>
      <p><strong>Applicant:</strong> {permit.applicant_name}</p>
      <p><strong>Permit Type:</strong> {permit.permit_type}</p>
      <p><strong>Issue Date:</strong> {new Date(permit.issue_date).toLocaleDateString()}</p>
      <p><strong>Expiration Date:</strong> {new Date(permit.expiration_date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {permit.status}</p>
    </div>
  )
}

export default PrintPermit