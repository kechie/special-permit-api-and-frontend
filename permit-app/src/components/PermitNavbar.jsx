import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const PermitNavbar = () => {
  const { isAuthenticated, hasRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Navbar.Brand as={Link} to="/">
        <img
          src="CMO-seal-300x300.webp"
          width="48"
          height="48"
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