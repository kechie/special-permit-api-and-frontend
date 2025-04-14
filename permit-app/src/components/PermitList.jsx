import React, { useEffect, useState } from 'react';
import { Table, Button, Form, InputGroup, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PermitList = () => {
  const { role } = useAuth();
  const [permits, setPermits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTopModal, setShowTopModal] = useState(false);
  const [showPermitModal, setShowPermitModal] = useState(false);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const API_BASE_URL = 'http://localhost:3021/api';

  const fetchPermits = async (search = '') => {
    try {
      const token = localStorage.getItem('spclpermittoken');
      const response = await axios.get(`${API_BASE_URL}/permits`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search },
      });
      //console.log('API Response:', response.data);
      setPermits(response.data.permits);
    } catch (err) {
      console.error('Error fetching permits:', err);
    }
  };

  useEffect(() => {
    fetchPermits();
  }, []);

  const handleSearch = () => {
    fetchPermits(searchTerm);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('spclpermittoken');
      await axios.delete(`${API_BASE_URL}/permits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPermits(permits.filter((permit) => permit.id !== id));
    } catch (err) {
      console.error('Error deleting permit:', err);
    }
  };

  const handleShowTopModal = async (id) => {
    setModalError('');
    setModalLoading(true);
    setShowTopModal(true);
    try {
      const token = localStorage.getItem('spclpermittoken');
      const response = await axios.get(`${API_BASE_URL}/permits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPermit(response.data);
    } catch (err) {
      setModalError(
        err.response?.status === 401
          ? 'Session expired. Please log in again.'
          : err.response?.data?.message || 'Error fetching permit.'
      );
      console.error('Error fetching TOP permit:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleShowPermitModal = async (id) => {
    setModalError('');
    setModalLoading(true);
    setShowPermitModal(true);
    try {
      const token = localStorage.getItem('spclpermittoken');
      const response = await axios.get(`${API_BASE_URL}/permits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPermit(response.data);
    } catch (err) {
      setModalError(
        err.response?.status === 401
          ? 'Session expired. Please log in again.'
          : err.response?.data?.message || 'Error fetching permit.'
      );
      console.error('Error fetching Print permit:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateFeesPaid = (permit) => {
    const fees = [
      permit.business_tax,
      permit.mayors_permit_fee,
      permit.individual_mayors_permit_fee,
      permit.health_certificate,
      permit.laboratory,
      permit.sanitary_permit,
      permit.garbage_fee,
      permit.sticker_fee,
    ];
    return fees.reduce((sum, fee) => sum + (parseFloat(fee) || 0), 0).toFixed(2);
  };

  const formatPermitNo = (id) => {
    const year = new Date().getFullYear();
    return `${year}-${id.slice(0, 3).toUpperCase()}`;
  };

  return (
    <div className="container mt-3">
      <style>
        {`
          .permit-document {
            font-family: Arial, sans-serif;
            line-height: 1.5;
          }
          .permit-document h1, .permit-document h2 {
            text-align: center;
            text-transform: uppercase;
            margin: 0.5em 0;
          }
          .permit-document .header {
            text-align: center;
            margin-bottom: 1em;
          }
          .permit-document .field {
            margin: 0.5em 0;
          }
          .permit-document .field strong {
            display: inline-block;
            width: 150px;
          }
          .permit-document .restrictions {
            margin: 1em 0;
            font-size: 0.9em;
          }
          .permit-document .signature {
            margin-top: 2em;
            text-align: right;
          }
          .permit-document .signature p {
            margin: 0.2em 0;
          }
          @media print {
            body > * { display: none !important; }
            .modal.print-only { display: block !important; }
            .modal.print-only .modal-dialog { margin: 0; width: 100%; }
            .modal.print-only .modal-content { border: none; box-shadow: none; }
            .modal.print-only .modal-header,
            .modal.print-only .modal-footer { display: none !important; }
            .modal.print-only .modal-body { padding: 20px; }
            .modal.print-only .print-only-content { display: block !important; }
          }
        `}
      </style>
      <h3>Permits</h3>
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search permits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outline-secondary" onClick={handleSearch}>
          Search
        </Button>
      </InputGroup>

      <Link to="/permits/new">
        <Button variant="primary" className="mb-3">
          Create Permit
        </Button>
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
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Print TOP Modal */}
      <Modal
        show={showTopModal}
        onHide={() => setShowTopModal(false)}
        size="lg"
        className="print-only"
      >
        <Modal.Header closeButton>
          <Modal.Title>Tax Order of Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalLoading && <p>Loading...</p>}
          {modalError && <Alert variant="danger">{modalError}</Alert>}
          {selectedPermit && !modalLoading && !modalError && (
            <div className="print-only-content">
              <p><strong>Applicant:</strong> {selectedPermit.applicant_name}</p>
              <p><strong>Permit Type:</strong> {selectedPermit.permit_type}</p>
              <p>
                <strong>Business Tax:</strong> ₱
                {parseFloat(selectedPermit.business_tax).toFixed(2)}
              </p>
              <p>
                <strong>Mayor's Permit Fee:</strong> ₱
                {parseFloat(selectedPermit.mayors_permit_fee).toFixed(2)}
              </p>
              <p>
                <strong>Individual Mayor's Permit Fee:</strong> ₱
                {parseFloat(selectedPermit.individual_mayors_permit_fee).toFixed(2)}
              </p>
              <p>
                <strong>Health Certificate:</strong> ₱
                {parseFloat(selectedPermit.health_certificate).toFixed(2)}
              </p>
              <p>
                <strong>Laboratory:</strong> ₱
                {parseFloat(selectedPermit.laboratory).toFixed(2)}
              </p>
              <p>
                <strong>Sanitary Permit:</strong> ₱
                {parseFloat(selectedPermit.sanitary_permit).toFixed(2)}
              </p>
              <p>
                <strong>Garbage Fee:</strong> ₱
                {parseFloat(selectedPermit.garbage_fee).toFixed(2)}
              </p>
              <p>
                <strong>Sticker Fee:</strong> ₱
                {parseFloat(selectedPermit.sticker_fee).toFixed(2)}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTopModal(false)}>
            Close
          </Button>
          {selectedPermit && !modalLoading && !modalError && (
            <Button variant="primary" onClick={handlePrint}>
              Print
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Print Permit Modal */}
      <Modal
        show={showPermitModal}
        onHide={() => setShowPermitModal(false)}
        size="lg"
        className="print-only"
      >
        <Modal.Header closeButton>
          <Modal.Title>Permit Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalLoading && <p>Loading...</p>}
          {modalError && <Alert variant="danger">{modalError}</Alert>}
          {selectedPermit && !modalLoading && !modalError && (
            <div className="print-only-content permit-document">
              {selectedPermit.permit_type === 'peddler' ? (
                <>
                  <div className="header">
                    <p className="field">
                      <strong>PERMIT NO.:</strong> {formatPermitNo(selectedPermit.id)}
                    </p>
                    <p className="field">
                      <strong>CART #</strong> 001
                    </p>
                    {selectedPermit.status === 'renewed' && <p>RENEW</p>}
                    <h1>PEDDLER'S PERMIT</h1>
                  </div>
                  <p>
                    In accordance with the provisions of the Revenue Code of the City of Laoag, PERMIT is hereby granted to {selectedPermit.applicant_name}, of Unknown Address, Laoag City to conduct his/her business generally known as: PEDDLER (Barangay): to sell {selectedPermit.permit_type === 'peddler' ? 'RICE IN A BOWL' : 'UNKNOWN'} in the City of Laoag, subject to the rules and regulations prescribed in said Revenue Code and all existing laws applicable thereto:
                  </p>
                  <p className="restrictions">
                    PROVIDED THAT THERE WILL BE NO SELLING AND DISPLAYING OF WARES AND GOODS ON THE PUBLIC ROADS, STREETS, SIDEWALKS/SIDEWAYS AND IN ANY PART OF THE MARKET. PROVIDED FURTHER, THAT CITY ORDINANCE NO. 97-043 (OPLAN DALUS CODE) SHALL BE STRICTLY COMPLIED WITH". FURTHERMORE, PROVIDED THAT THERE WILL BE NO SELLING AND DISPLAYING AT RIZAL STREET, BONIFACIO STREET AND INFRONT OF CENTENNIAL ARENA.
                    <br />
                    (MASAPUL A SAAN NGA AGLAKO KEN AGI-DISPLAY ITI TAGILAKO NA ITI PAMPUBLIKO A KALSADA, DALAN, IGID TI KALSADA KEN ITI ANIAMAN A PASET TI TIENDAAN. MASAPUL PAY ITI NAIGET A PANANGSUROT ITI CITY ORDINANCE NO. 97-043 (OPLAN DALUS CODE). MALAKSID ITI DAYTA, MAIPARIT PAY NGA AGLAKO KEN MANGI-DISPLAY TI LAKO ITI RIZAL STREET, BONIFACIO STREET KEN SANGO TI CENTENNIAL ARENA.)
                  </p>
                  <p>
                    This PERMIT shall neither be negotiable nor transferable and shall be valid only for the operation or conduct of the aforesaid business at the place given above for the period upon approval until {new Date(selectedPermit.expiration_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
                  </p>
                  <p>
                    Should the application for the issuance of PERMIT be found to contain deceitful purpose, this PERMIT shall be considered null and void ab Initio.
                  </p>
                  <p>
                    Given this {new Date(selectedPermit.issue_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} at the City of Laoag, Philippines.
                  </p>
                  <div className="signature">
                    <p>MICHAEL MARCOS KEON</p>
                    <p>City Mayor</p>
                  </div>
                  <div className="signature">
                    <p>By the Authority of the City Mayor:</p>
                    <p>ATTY. FRANKLIN T. CALUMAG</p>
                    <p>City Administrator</p>
                  </div>
                  <div className="field">
                    <p><strong>Fees Paid:</strong> Php {calculateFeesPaid(selectedPermit)}</p>
                    <p><strong>O.R. No.:</strong> 2847436</p>
                    <p><strong>Issued on:</strong> {new Date(selectedPermit.issue_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p><strong>Issued at:</strong> Laoag City</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="header">
                    <h2>REPUBLIC OF THE PHILIPPINES</h2>
                    <h2>Province of Ilocos Norte</h2>
                    <p>OFFICE OF THE CITY MAYOR</p>
                    <p>BUSINESS PERMIT AND LICENSING OFFICE</p>
                    <h1>MAYOR’S PERMIT</h1>
                  </div>
                  <div className="field">
                    <p><strong>PERMIT NO:</strong> {formatPermitNo(selectedPermit.id)}</p>
                    <p><strong>DATE:</strong> {new Date(selectedPermit.issue_date).toLocaleDateString()}</p>
                  </div>
                  <p>THIS CERTIFIES that</p>
                  <p>{selectedPermit.applicant_name}</p>
                  <p>Of Unknown Address, Laoag City, Ilocos Norte</p>
                  <p>Is engaged in selling of:</p>
                  <p>{selectedPermit.permit_type === 'special' ? 'FOOTWEAR/DRY GOODS' : 'UNKNOWN'}</p>
                  <p>AT Unknown Location, Laoag City, Ilocos Norte</p>
                  <p>has been granted to operate the following business/es</p>
                  <p>RETAILER</p>
                  <p>
                    This permit is subject to the condition that all Laws, Ordinances, Resolutions, General Orders, Presidential Decrees, Letters of Instructions and Letters of Implementation governing the matter that shall be strictly complied with.
                  </p>
                  <p>
                    VALID UP TO {new Date(selectedPermit.expiration_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <div className="signature">
                    <p>APPROVED:</p>
                    <p>MICHAEL MARCOS KEON</p>
                    <p>City Mayor</p>
                  </div>
                </>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPermitModal(false)}>
            Close
          </Button>
          {selectedPermit && !modalLoading && !modalError && (
            <Button variant="primary" onClick={handlePrint}>
              Print
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PermitList;