import { Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomeComponent = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const { role } = useAuth();
  return (
    <Card style={{ width: '36rem' }} className="mb-3 mx-auto">
      <Card.Body>
        <Card.Title>Welcome to Special Permit Management</Card.Title>
        <Card.Text>
          Manage peddler and special permits with ease.<br />
          Submit applications, track statuses, and handle fees like business tax, mayor’s permit, health
          certificates, and more, all in one place.<br />
          {isAuthenticated ? ((role === 'monitor' || role === 'superadmin' || role === 'admin') ? (
            <span>

              <Button
                as={Link}
                to="/monitor"
                variant="primary"
                className="me-2"
              >
                Monitor
              </Button>
            </span>) :
            <span>
              <Button
                as={Link}
                to="/permits"
                variant="primary"
                className="me-2"
              >
                View Permits
              </Button>
            </span>
          ) : (
            <span>
              <br />
              Log in to create or view your permit applications.
            </span>
          )}
        </Card.Text>
        {isAuthenticated ? (
          <>
            <Button
              variant="outline-danger"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button as={Link} to="/login" variant="primary">
            Login
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default HomeComponent;