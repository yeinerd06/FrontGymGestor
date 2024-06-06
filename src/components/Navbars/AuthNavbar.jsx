
import { Link } from "react-router-dom";
// reactstrap components
import {
  NavbarBrand,
  Navbar,
  Container,
  Row,
   UncontrolledCollapse,
  
  NavItem,
  NavLink,
  Nav,
  Col,

} from "reactstrap";
//import logo from "../../assets/img/brand/logo.svg";
import { useUserContext } from "../Context/UserContext";

import  logoDefault  from "../../assets/img/brand/logo.png";
const AdminNavbar = () => {
  const {logoImg}=useUserContext();
  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-dark " expand="md">
        <Container className="px-4">
          <NavbarBrand to="/" tag={Link}>
          {logoImg==="" ?(
            <img
            alt="Cargando..."
            src={logoDefault}
          />
          ):(
            <img
              alt="Cargando..."
              src={logoImg}
            />
          )}
          </NavbarBrand>
          <button className="navbar-toggler" id="navbar-collapse-main">
            <span className="navbar-toggler-icon" />
          </button>
          <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
            <div className="navbar-collapse-header d-md-none">
              <Row>
                <Col className="collapse-brand" xs="6">
                  <Link to="/auth/index">
                    <img
                      alt="..."
                      src={logoImg}
                    />
                  </Link>
                </Col>
                <Col className="collapse-close" xs="6">
                  <button className="navbar-toggler" id="navbar-collapse-main">
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink className="nav-link-icon" to="/auth/index" tag={Link}>
                  <i className="fa fa-home" />
                  <span className="nav-link-inner--text">Home</span>
                </NavLink>
              </NavItem>
              {/* <NavItem>
                <NavLink className="nav-link-icon" tag={Link}
                to="/auth/login?modulo=admin">
                  <i className="fa fa-building" />
                  <span className="nav-link-inner--text">Corporativo</span>
                </NavLink>
              </NavItem> */}
              <NavItem>
                <NavLink
                  className="nav-link-icon"
                  to="/auth/login?modulo=cliente"
                  tag={Link}
                  
                >
                  <i className="fa fa-user" />
                  <span className="nav-link-inner--text">Iniciar Sesion</span>
                </NavLink>
              </NavItem>
            </Nav>
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
