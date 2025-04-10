// src/components/PermitList.jsx
import React, { useEffect, useState } from 'react'
import { Table, Button } from 'react-bootstrap'
import axios from 'axios'
import { Link } from 'react-router-dom'

const PermitList = () => {
  const [permits, setPermits] = useState([])

  useEffect(() => {
    const fetchPermits = async () => {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:5000/api/permits', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPermits(response.data)
    }
    fetchPermits()
  }, [])

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:5000/api/permits/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    setPermits(permits.filter((permit) => permit.id !== id))
  }

  return (
    <div>
      <h3>Permits</h3>
      <Link to="/permits/create">
        <Button variant="primary" className="mb-3">Create Permit</Button>
      </Link>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Type</th>
            <th>Issue Date</th>
            <th>Expiration Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {permits.map((permit) => (
            <tr key={permit.id}>
              <td>{permit.applicant_name}</td>
              <td>{permit.permit_type}</td>
              <td>{new Date(permit.issue_date).toLocaleDateString()}</td>
              <td>{new Date(permit.expiration_date).toLocaleDateString()}</td>
              <td>{permit.status}</td>
              <td>
                <Link to={`/permits/edit/${permit.id}`}>
                  <Button variant="warning" className="mr-2">Edit</Button>
                </Link>
                <Button variant="danger" onClick={() => handleDelete(permit.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default PermitList
