// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"; // Importa íconos de redes sociales
import logo from "../../assets/img/brand/logo.svg";
import { Link } from "react-router-dom";

const Login = () => {

  return (
    <>
      <footer className="py-5 bg-primary text-white">
        <Container>
          <Row className="text-center justify-content-center">
            {/* <Col xl="4">
              <div className="text-center text-xl-left">
                <Link to="/">
                  <img alt="..." src={logoImg} />
                </Link>
              </div>
            </Col> */}
            <Col xl="8">
              <p className="mt-7">Mejora tu salud y bienestar con nosotros.</p>
            </Col>
          </Row>
          <hr className="bg-white" />
          <Row className="align-items-center justify-content-xl-between">
            <Col xl="12">
              <Nav className="nav-footer justify-content-center justify-content-xl-center h1 ">
                <NavItem>
                  <NavLink href="/training" className="text-white">
                    Entrenamiento
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/training" className="text-white">
                    Membresias
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/contact" className="text-white">
                    Contacto
                  </NavLink>
                </NavItem>
              </Nav>
            </Col>
          </Row>
          <hr className="bg-white" />
          <Row className="mt-3">
            <Col className="text-center">
              <div className="social-icons">
                <a
                  href="https://www.facebook.com/smartfit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook className="text-white mr-3" size={30} />
                </a>
                <a
                  href="https://www.instagram.com/smartfit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className="text-white mr-3" size={30} />
                </a>
                <a
                  href="https://twitter.com/smartfit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter className="text-white mr-3" size={30} />
                </a>
                <a
                  href="https://www.youtube.com/smartfit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube className="text-white" size={30} />
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Login;
