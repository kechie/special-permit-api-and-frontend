import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import BPLOLogo from '../assets/bplo-logo.png';

const PermitNavbar = () => {
  const { isAuthenticated, hasRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="mb-3">
      <Navbar.Brand as={Link} to="/">
        <img
          src={BPLOLogo}
          width="52"
          height="52"
          className="d-inline-block align-top"
          alt="React Bootstrap logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
        </Nav>
        <Nav>
          {/*hasRole(['superadmin', 'admin', 'staff']) && (
            <Nav.Link as={Link} to="/permits/new">New Permit</Nav.Link>
          )*/}
          {hasRole(['superadmin', 'monitor']) && (
            <Nav.Link as={Link} to="/monitor">Monitor</Nav.Link>
          )}
        </Nav>
        <Nav>
          {isAuthenticated ? (
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default PermitNavbar;