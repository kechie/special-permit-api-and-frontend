import { Container } from 'react-bootstrap';
//import BPLOLogo from '../assets/bplo-logo.png';
import BagongPilipinasLogo from '../assets/bagongpilipinaslores.webp';
import BaroALaoagLogo from '../assets/baroalaoag.png';
const Footer = () => {
  return (
    <footer className="mt-3">
      <Container className="py-3 text-center">
        <img
          src={BaroALaoagLogo}
          height="60"
          className="d-inline-block"
          alt="Baro a Laoag Logo"
        />
        <img
          src={BagongPilipinasLogo}
          height="60"
          className="d-inline-block"
          alt="Bagong Pilipinas Logo"
        />
        <p>&copy; {new Date().getFullYear()} City Government of Laoag. All rights reserved.<br />
          <small>coding by: Laoag City ICTO App Dev Team</small></p>
      </Container>
    </footer >
  );
};

export default Footer;
