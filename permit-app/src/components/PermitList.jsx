//file PermitList.jsx
// PermitList.jsx
// This file contains the PermitList component, which displays a list of permits
// and allows users to search, create, edit, and delete permits.
// It also includes modals for printing the Tax Order of Payment (TOP) and the permit itself.
//
// It uses React, React Router, and Bootstrap for styling and layout.
// It also uses axios for making API requests and qrcode.react for generating QR codes.
//
import React, { useEffect, useState } from 'react';
//import { Card, Table, Button, Form, InputGroup, Modal, Alert, Pagination, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Card, Table, Button, Form, InputGroup, Modal, Alert, Pagination, Row, Col } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AllCapitalize, capitalizeFirstLetter, formatDate } from '../utils/helpers';
import {
  Search,
  PlusCircle,
  Pencil,
  Trash,
  Printer,
  Receipt,
  Justify
} from 'react-bootstrap-icons';
import laoagLogo from '../assets/laoag-logo.png';
import BPLOLogo from '../assets/bplo-logo.png';
import MMKSig from '../assets/mmk-sig.png';
import AAPLogo from '../assets/aap.png';

const PermitList = () => {
  const { role } = useAuth();
  const [permits, setPermits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTopModal, setShowTopModal] = useState(false);
  const [showPermitModal, setShowPermitModal] = useState(false);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10); // Matches API limit
  //const API_BASE_URL = 'http://localhost:3021/api';

  // Determine API URL based on environment
  const API_BASE_URL =
    import.meta.env.VITE_NODE_ENV === 'production'
      ? import.meta.env.VITE_BASE_API_URL_PROD
      : import.meta.env.VITE_NODE_ENV === 'test'
        ? import.meta.env.VITE_BASE_API_URL_TEST
        : import.meta.env.VITE_BASE_API_URL_DEV;
  const navigate = useNavigate();

  const fetchPermits = React.useCallback(async (search = '', page = 1) => {
    try {
      const token = localStorage.getItem('spclpermittoken');
      const response = await axios.get(`${API_BASE_URL}/permits`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search, page, limit: itemsPerPage },
      });
      setPermits(response.data.permits);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage); // Sync with API
    } catch (err) {
      console.error('Error fetching permits:', err);
      setPermits([]);
      setTotalPages(1);
    }
  }, [API_BASE_URL, itemsPerPage]);

  useEffect(() => {
    fetchPermits(searchTerm, currentPage);
  }, [currentPage, fetchPermits, searchTerm]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to page 1 on search
    fetchPermits(searchTerm, 1);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('spclpermittoken');
      await axios.delete(`${API_BASE_URL}/permits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh or adjust page
      if (permits.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchPermits(searchTerm, currentPage);
      }
    } catch (err) {
      console.error('Error deleting permit:', err);
    }
  };
  // Add handleEdit function with other handlers
  const handleEdit = (id) => {
    navigate(`/permits/${id}/edit`);
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

  const formatPermitNo = (id) => {
    const year = new Date().getFullYear();
    return `${year}-${id.slice(0, 3).toUpperCase()}`;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Add QR code generator function
  const generateQRValue = (permit) => {
    /*
    console.log(formatPermitNo(permit.id));
    console.log(permit.id);
    return JSON.stringify({
      permitNo: permit.id,
      name: permit.applicant_name,
      type: permit.permit_type,
      issued: permit.issue_date,
      expires: permit.expiration_date,
      or: permit.or_number
    }); */
    //console.log(import.meta.env.BASE_URL);
    //console.log(`${import.meta.env.VITE_HOST_PROD}/status/${permit.id}`);
    return `${import.meta.env.VITE_HOST_PROD}/status/${permit.id}`;
  };

  /*   const tooltip = (
      <Tooltip id="tooltip">
        <strong>Holy guacamole!</strong> Check this info.
      </Tooltip>
    ); */
  return (
    <div className="container mt-3">
      <Card>
        <Card.Body>
          <Card.Title>Permits</Card.Title>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search permits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={handleSearch}>
              <Search className="me-1" />Find
            </Button>
          </InputGroup>

          <Link to="/permits/new">
            <Button variant="primary" className="mb-3">
              <PlusCircle className="me-1" />New Permit
            </Button>
          </Link>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Type</th>
                <th>Application Date</th>
                <th>Issue Date</th>
                <th>Expiration Date</th>
                <th>Amount Paid</th>
                <th>OR Number</th>
                <th>Actions</th>
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
                  <td>{capitalizeFirstLetter(permit.amount_paid)}</td>
                  <td>{permit.or_number}</td>
                  <td>
                    {(role === 'assessment' || role === 'admin' || role === 'superadmin') && (
                      <Button
                        variant="warning"
                        className="me-2"
                        onClick={() => handleEdit(permit.id)}
                        disabled={!!permit.amount_paid && !!permit.or_number}
                        title={permit.amount_paid && permit.or_number
                          ? "Cannot edit paid permits"
                          : "Edit permit"
                        }>
                        <Pencil className="me-1" />{/* Edit */}
                      </Button>
                    )}
                    {(role === 'admin' || role === 'superadmin') && (
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(permit.id)}
                        className="me-2"
                        disabled={!!permit.amount_paid && !!permit.or_number}
                        title={
                          permit.amount_paid && permit.or_number
                            ? "Cannot delete paid permits"
                            : "Delete permit"
                        }
                      >
                        <Trash className="me-1" />{/* Delete */}
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      onClick={() => handleShowTopModal(permit.id)}
                      className="me-2"
                      disabled={permit.amount_paid && permit.or_number}
                    >
                      <Receipt className="me-1" />{/* Print TOP */}
                    </Button>
                    <Button
                      variant="info"
                      onClick={() => handleShowPermitModal(permit.id)}
                      className="me-2"
                    >
                      <Printer className="me-1"
                      />
                    </Button>
                  </td>
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
        </Card.Body>
      </Card>

      {/* Print TOP Modal */}
      <Modal
        show={showTopModal}
        onHide={() => setShowTopModal(false)}
        size="lg"
        className="print-only legal-paper"
      >
        <Modal.Header closeButton>
          <Modal.Title>Tax Order of Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalLoading && <p>Loading...</p>}
          {modalError && <Alert variant="danger">{modalError}</Alert>}
          {selectedPermit && !modalLoading && !modalError && (
            <div className="print-only-content">
              <div className="header permit-header">
                <div className="logo-container">
                  <img src={laoagLogo} alt="Laoag City Logo" className="header-logo" />
                </div>
                <div className="header">
                  <h2>REPUBLIC OF THE PHILIPPINES</h2>
                  <h3>Province of Ilocos Norte</h3>
                  <h3>City Of Laoag</h3>
                  <p>OFFICE OF THE CITY MAYOR</p>
                  <p>BUSINESS PERMIT AND LICENSING OFFICE</p>
                </div>
                <div className="logo-container">
                  <img src={BPLOLogo} alt="BPLO Logo" className="header-logo" />
                </div>
              </div>
              <p align="center"><strong>Tax Order of Payment:</strong></p>
              <p><strong>Applicant:</strong> {selectedPermit.applicant_name}</p>
              <p><strong>Applying for:</strong> {capitalizeFirstLetter(selectedPermit.permit_type)}</p>
              <p><strong>Product/Service:</strong> {selectedPermit.product_or_service}</p>
              <p>
                <strong>Business Tax:</strong> ₱
                {parseFloat(selectedPermit.business_tax).toFixed(2)}
              </p>
              <p>
                <strong>Peddlers Tax:</strong> ₱
                {parseFloat(selectedPermit.peddlers_tax).toFixed(2)}
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
              {/*selectedPermit.number_of_employees && (
                <p>
                  <strong>Number of Employees:</strong> {selectedPermit.number_of_employees}
                </p>
              )*/}
              <hr />
              {selectedPermit.amount_due && (
                <p>
                  <strong>Amount Due:</strong> ₱{selectedPermit.amount_due}
                </p>
              )}
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
        className="print-only legal-paper"
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
                  <div className="header permit-header">
                    <div className="logo-container">
                      <img src={laoagLogo} alt="Laoag City Logo" className="header-logo" />
                    </div>
                    <div className="header">
                      <h2>REPUBLIC OF THE PHILIPPINES</h2>
                      <h2>Province of Ilocos Norte</h2>
                      <h3>OFFICE OF THE CITY MAYOR</h3>
                      <h3>BUSINESS PERMIT AND LICENSING OFFICE</h3>
                    </div>
                    <div className="logo-container">
                      <img src={BPLOLogo} alt="BPLO Logo" className="header-logo" />
                    </div>
                  </div>
                  <div className='field'>
                    <strong>PERMIT NO.:</strong> {formatPermitNo(selectedPermit.id)}<br />
                    <strong>CART #</strong> {formatPermitNo(selectedPermit.id) + " - 1"}
                    <h2 align="center">PEDDLER'S PERMIT</h2>
                  </div>
                  {/*selectedPermit.status === 'renewed' && <p>RENEW</p>*/}
                  <p align="justify">In accordance with the provisions of the Revenue Code of the City of Laoag, PERMIT is hereby granted to {selectedPermit.applicant_name}, of {selectedPermit.applicant_address}, Laoag City to conduct his/her business generally known as: PEDDLER (Barangay): to sell {selectedPermit.permit_type === 'peddler' ? AllCapitalize(selectedPermit.product_or_service) : 'UNKNOWN'} in the City of Laoag, subject to the rules and regulations prescribed in said Revenue Code and all existing laws applicable thereto:</p>
                  <p className="restrictions" style={{ paddingLeft: '2rem', paddingRight: '2rem', align: Justify }}>PROVIDED THAT THERE WILL BE NO SELLING AND DISPLAYING OF WARES AND GOODS ON THE PUBLIC ROADS, STREETS, SIDEWALKS/SIDEWAYS AND IN ANY PART OF THE MARKET. PROVIDED FURTHER, THAT CITY ORDINANCE NO. 97-043 (OPLAN DALUS CODE) SHALL BE STRICTLY COMPLIED WITH". FURTHERMORE, PROVIDED THAT THERE WILL BE NO SELLING AND DISPLAYING AT RIZAL STREET, BONIFACIO STREET AND INFRONT OF CENTENNIAL ARENA.</p>
                  <p className="restrictions" style={{ paddingLeft: '2rem', paddingRight: '2rem', align: Justify }}>(MASAPUL A SAAN NGA AGLAKO KEN AGI-DISPLAY ITI TAGILAKO NA ITI PAMPUBLIKO A KALSADA, DALAN, IGID TI KALSADA KEN ITI ANIAMAN A PASET TI TIENDAAN. MASAPUL PAY ITI NAIGET A PANANGSUROT ITI CITY ORDINANCE NO. 97-043 (OPLAN DALUS CODE). MALAKSID ITI DAYTA, MAIPARIT PAY NGA AGLAKO KEN MANGI-DISPLAY TI LAKO ITI RIZAL STREET, BONIFACIO STREET KEN SANGO TI CENTENNIAL ARENA.)</p>
                  <p align="justify">This PERMIT shall neither be negotiable nor transferable and shall be valid only for the operation or conduct of the aforesaid business at the place given above for the period upon approval until {formatDate(selectedPermit.expiration_date)}.</p>
                  <p align="justify">Should the application for the issuance of PERMIT be found to contain deceitful purpose, this PERMIT shall be considered null and void ab Initio.</p>
                  <p>Given this {formatDate(selectedPermit.issue_date)} at the City of Laoag, Philippines.</p>
                  <div className="signature">
                    <br />
                    <br />
                    {/* <img src={MMKSig} alt="MMK Signature" className="header-logo" /> */}
                    <p>JAMES BRYAN Q. ALCID</p>
                    <p>City Mayor</p>
                  </div>
                  <div className="signature">
                    <p>By the Authority of the City Mayor:</p>
                    <br />
                    <br />
                    <p>ATTY. ED VON ALLAN F. CID</p>
                    <p>City Administrator</p>
                  </div>
                  <Row>
                    <Col md={3} className="print-col">
                      <img
                        src={AAPLogo}
                        height="60"
                        className="d-inline-block"
                        alt="Alisto Asenso Progreso Logo"
                      />
                    </Col>
                    <Col md={3} className="print-col">
                      <div className="field">
                        <strong>Fees Paid:</strong> Php {selectedPermit.amount_paid}<br />
                        <strong> O.R. No.:</strong> {selectedPermit.or_number}<br />
                        <strong>Issued on:</strong> {formatDate(selectedPermit.issue_date)}<br />
                        <strong>Issued at:</strong> Laoag City<br />
                      </div>
                    </Col>
                    <Col md={6} className="print-col">
                      <div className="qr-container">
                        <QRCodeSVG
                          value={generateQRValue(selectedPermit)}
                          size={128}
                          level="H"
                          marginSize="2"
                        />
                      </div>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <div className="header permit-header">
                    <div className="logo-container">
                      <img src={laoagLogo} alt="Laoag City Logo" className="header-logo" />
                    </div>
                    <div className="header">
                      <h3>REPUBLIC OF THE PHILIPPINES</h3>
                      <h3>Province of Ilocos Norte</h3>
                      <p>OFFICE OF THE CITY MAYOR</p>
                      <p>BUSINESS PERMIT AND LICENSING OFFICE</p>
                      <h3>MAYOR’S PERMIT</h3>
                    </div>
                    <div className="logo-container">
                      <img src={BPLOLogo} alt="BPLO Logo" className="header-logo" />
                    </div>
                  </div>
                  <div className="field">
                    <p><strong>PERMIT NO:</strong> {formatPermitNo(selectedPermit.id)} <span><strong>DATE:</strong> {formatDate(selectedPermit.issue_date)}</span></p>
                  </div>
                  <br />
                  <p>THIS CERTIFIES that</p>
                  <h3 align="center">{AllCapitalize(selectedPermit.applicant_name)}</h3>
                  <p align="center">Of {selectedPermit.applicant_address}</p>
                  <p align="center">Is engaged in selling of:</p>
                  <h3 align="center">{AllCapitalize(selectedPermit.product_or_service)}</h3>
                  <p align="center">AT {selectedPermit.business_address}, Laoag City, Ilocos Norte has been granted to operate the following business/es</p>
                  <br />
                  <h3 align="center">{selectedPermit.business_type}</h3>
                  <br />
                  <p align="justify"><strong>This permit is subject to the condition that all Laws, Ordinances, Resolutions, General Orders, Presidential Decrees, Letters of Instructions and Letters of Implementation governing the matter that shall be strictly complied with.</strong></p><p>
                  </p>
                  <div className="signature">
                    VALID UP TO <br />{formatDate(selectedPermit.expiration_date)}
                  </div>
                  <div className="signature">
                    <Row>
                      <Col md={6} className="print-col">
                        <p>APPROVED:</p>
                        <br />
                        <br />
                        <br />
                        {/*                     <img src={MMKSig} alt="MMK Signature" className="header-logo" />*/}
                        <p>JAMES BRYAN Q. ALCID<br />
                          City Mayor</p>
                      </Col>
                    </Row>
                  </div>
                  <Row className="print-row">
                    <Col md={3} className="print-col">
                      <img
                        src={AAPLogo}
                        height="60"
                        className="d-inline-block"
                        alt="Alisto Asenso Progreso Logo"
                      />
                    </Col>
                    <Col md={3} className="print-col">
                      <strong>Number of Employees:</strong> {selectedPermit.number_of_employees}<br />
                      <strong>Fees Paid:</strong> Php {selectedPermit.amount_paid}<br />
                      <strong> O.R. No.:</strong> {selectedPermit.or_number}<br />
                      <br />
                      <br />
                      <strong>Issued on:</strong> {formatDate(selectedPermit.issue_date)}<br />

                    </Col>
                    <Col md={6} className="print-col">
                      <div className="qr-container">
                        <QRCodeSVG
                          value={generateQRValue(selectedPermit)}
                          size={128}
                          level="H"
                          marginSize="2"
                        />
                      </div>
                    </Col>
                  </Row>
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
    </div >
  );
};

export default PermitList;