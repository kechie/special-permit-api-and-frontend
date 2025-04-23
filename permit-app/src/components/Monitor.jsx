import { Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MonitorComponent = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /*   const handleLogout = () => {
      logout();
      navigate('/');
    }; */

  return (
    <Card style={{ width: '36rem' }} className="mb-3 mx-auto">
      <Card.Body>
        <Card.Title>Welcome to Special Permit Management Monitor Dasboard</Card.Title>
        <Card.Text>
          This is a placeholder component for Monitor Dashboard
          {isAuthenticated ? (
            <span>
              <br />
              Monitoring dashboard is under construction.<br /> You're logged in—start managing your permits now!
            </span>
          ) : (
            <span>
              <br />
              Log in to create or view your permit applications.
            </span>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default MonitorComponent;