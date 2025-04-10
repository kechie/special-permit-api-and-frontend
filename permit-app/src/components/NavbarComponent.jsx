// src/components/NavbarComponent.jsx
import { Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'

const NavbarComponent = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">Permit App</Navbar.Brand>
      <Nav className="ml-auto">
        <Link className="nav-link" to="/login">Login</Link>
        <Link className="nav-link" to="/register">Register</Link>
        <Link className="nav-link" to="/permits">Permits</Link>
      </Nav>
    </Navbar>
  )
}

export default NavbarComponent
