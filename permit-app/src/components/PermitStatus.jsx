// src/components/PrintPermit.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const PermitStatus = () => {
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
    console.log('API_BASE_URL:', API_BASE_URL);
    const fetchPermit = async () => {
      //const token = localStorage.getItem('spclpermittoken')
      const response = await axios.get(`${API_BASE_URL}/permits/noauth/${id}`)
      setPermit(response.data)
    }

    fetchPermit()
  }, [id, API_BASE_URL])

  /*   useEffect(() => {
      if (permit) {
        window.print()
      }
    }, [permit])
   */
  if (!permit) return <p>Loading...</p>

  return (
    <div className="container mt-5">
      {/*       <p>{permit.amount_paid},{permit.or_number}</p>*/}
      <h2 align="center">Your Special Permit is {permit.amount_paid && permit.or_number ? "Valid" : "Unpaid"}</h2>
      {/*       <p><strong>Applicant:</strong> {permit.applicant_name}</p>
      <p><strong>Permit Type:</strong> {permit.permit_type}</p>
      <p><strong>Issue Date:</strong> {new Date(permit.issue_date).toLocaleDateString()}</p>
      <p><strong>Expiration Date:</strong> {new Date(permit.expiration_date).toLocaleDateString()}</p> */}
    </div>
  )
}

export default PermitStatus