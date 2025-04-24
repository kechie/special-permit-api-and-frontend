import React, { useEffect, useState } from 'react';
import { Button, Card, Form, InputGroup, Row, Col, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  Pencil,
  Trash,
  Printer,
  Receipt
} from 'react-bootstrap-icons';

import { useAuth } from '../context/AuthContext';
import { capitalizeFirstLetter, formatDate } from '../utils/helpers';

const MonitorComponent = () => {
  //  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /*   const handleLogout = () => {
      logout();
      navigate('/');
    };
   */
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const { role } = useAuth();
  const [permits, setPermits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndStartDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10); // Matches API limit

  // Determine API URL based on environment
  const API_BASE_URL =
    import.meta.env.VITE_NODE_ENV === 'production'
      ? import.meta.env.VITE_BASE_API_URL_PROD
      : import.meta.env.VITE_NODE_ENV === 'test'
        ? import.meta.env.VITE_BASE_API_URL_TEST
        : import.meta.env.VITE_BASE_API_URL_DEV;

  // Add search handler
  const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchPermits(searchTerm, 1, startDate, endDate);
  };

  // Add date filter handler
  // const handleDateFilter = () => {
  //   setCurrentPage(1);
  //   fetchPermits(searchTerm, 1, startDate, endDate);
  // };

  // Modify the fetchPermits function to include date filtering
  const fetchPermits = React.useCallback(async (search = '', page = 1, start = '', end = '') => {
    try {
      const token = localStorage.getItem('spclpermittoken');
      const response = await axios.get(`${API_BASE_URL}/permits`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search,
          page,
          limit: itemsPerPage,
          startDate: start,
          endDate: end
        },
      });
      setPermits(response.data.permits);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      console.error('Error fetching permits:', err);
      setPermits([]);
      setTotalPages(1);
    }
  }, [API_BASE_URL, itemsPerPage]);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     fetchPermits(searchTerm, currentPage);
  //   }
  // }, [isAuthenticated, fetchPermits, searchTerm, currentPage]);

  useEffect(() => {
    fetchPermits(searchTerm, currentPage);
  }, [currentPage, fetchPermits, searchTerm, startDate, endDate]);

  return (
    <Card className="mb-3 mx-auto">
      <Card.Body>
        <Card.Title>Laoag City Treasury Office  - Special Permit Management Monitor Dasboard </Card.Title>
        {/* Add Search Form */}
        <Form onSubmit={handleSearch} className="mb-3">
          <Row>
            <InputGroup className="mb-3">
              <Col md={5}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Find by applicant name or permit type"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Form.Group>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndStartDate(e.target.value)}
                />
              </Form.Group>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm('');
                  setStartDate('');
                  setEndStartDate('');
                  fetchPermits('', 1);
                }}
              >
                Clear
              </Button>
              <Button type="submit" variant="primary" className="me-2">
                Search
              </Button>
            </InputGroup>
          </Row>

        </Form>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Type</th>
              <th>Application Date</th>
              <th>Issue Date</th>
              <th>Expiration Date</th>
              <th>Amount Due</th>
              <th>Amount Paid</th>
              <th>OR Number</th>
              <th>Status</th>
              {/*<th>View</th> */}
            </tr>
          </thead>
          <tbody>
            {permits.map((permit) => (
              <tr key={permit.id}>
                <td>{permit.applicant_name}</td>
                <td>{capitalizeFirstLetter(permit.permit_type)}</td>
                <td>{formatDate(permit.application_date)}</td>
                <td>{formatDate(permit.issue_date)}</td>
                <td>{formatDate(permit.expiration_date)}</td>
                <td>₱{permit.amount_due}</td>
                <td>₱{permit.amount_paid}</td>
                <td>{permit.or_number}</td>
                <td>{permit.status}</td>
                {/*<td>
                    <Link to={`/permits/${permit.id}/edit`}>
                    <Button variant="warning" className="me-2">
                      Edit
                    </Button>
                  </Link>
                  {(role === 'admin' || role === 'superadmin') && (
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(permit.id)}
                      className="me-2"
                    >
                      Delete
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => handleShowTopModal(permit.id)}
                    className="me-2"
                  >
                    Print TOP
                  </Button>
                  <Button
                    variant="info"
                    onClick={() => handleShowPermitModal(permit.id)}
                  >
                    Print Permit
                  </Button> 
                </td>*/}
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Pagination Component */}
        <Pagination className="justify-content-center">
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === currentPage}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </Card.Body >
    </Card >
  );
};

export default MonitorComponent;