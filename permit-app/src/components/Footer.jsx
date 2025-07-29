import { Container } from 'react-bootstrap';
//import BPLOLogo from '../assets/bplo-logo.png';
import BagongPilipinasLogo from '../assets/bagongpilipinaslores.webp';
import AAPLogo from '../assets/aap.png';
const Footer = () => {
  return (
    <footer className="mt-3">
      <Container className="py-3 text-center">
        <img
          src={AAPLogo}
          height="60"
          className="d-inline-block"
          alt="Alisto Asenso Progreso Logo"
        />
        <img
          src={BagongPilipinasLogo}
          height="60"
          className="d-inline-block"
          alt="Bagong Pilipinas Logo"
        />
        <p>&copy; {new Date().getFullYear()} City Government of Laoag. All rights reserved.<br />
          <small>coding by: eihcek information systems analyst I</small></p>
      </Container>
    </footer >
  );
};

export default Footer;
