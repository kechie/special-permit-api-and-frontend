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

  return (
    <Card style={{ width: '36rem' }} className="mb-3 mx-auto">
      <Card.Body>
        <Card.Title>Welcome to Special Permit Management</Card.Title>
        <Card.Text>
          Streamline your permit application process with our easy-to-use platform.
          Whether you're applying for a peddler or special permit, manage everything
          from submission to approval in one place.
          {isAuthenticated ? (
            <span>
              <br />
              You're logged in—start managing your permits now!
            </span>
          ) : (
            <span>
              <br />
              Log in to get started or learn more about our services.
            </span>
          )}
        </Card.Text>
        {isAuthenticated ? (
          <>
            <Button
              as={Link}
              to="/permits"
              variant="primary"
              className="me-2"
            >
              View Permits
            </Button>
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