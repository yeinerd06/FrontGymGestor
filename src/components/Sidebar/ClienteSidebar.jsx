/*eslint-disable*/
import { useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";

// reactstrap components
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  Input,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

import { useNavigate } from "react-router-dom";
import urlImagen from "../../assets/img/user.png";
import  logoDefault  from "../../assets/img/brand/logo.png";
import { useUserContext } from "../Context/UserContext";
const Sidebar = (props) => {
  const navigate = useNavigate();
  const modulo = localStorage.getItem("modulo");

  const { membresiaActiva, urlImagen ,logoImg} = useUserContext();
  // Función para cerrar sesión y redirigir al usuario al login
  const handleCerrarSesion = () => {
    // Borramos el token del localStorage
    localStorage.clear();

    // Redirigimos al usuario al login
    navigate("/auth/index", { replace: true });
    // window.location.replace("/auth/login");
  };
  const handlePerfil = () => {
    if (membresiaActiva && modulo === "cliente") {
      navigate("/" + modulo + "/perfil", { replace: true });
    } else if (modulo != "cliente") {
      navigate("/" + modulo + "/perfil", { replace: true });
    }
  };
  const [collapseOpen, setCollapseOpen] = useState();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  // toggles collapse between opened and closed (true/false)
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };
  // closes the collapse
  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes) => {
    if (membresiaActiva) {
      return routes.map((prop, key) => {
        return (
          <NavItem key={key}>
            <NavLink
              to={prop.layout + prop.path}
              tag={NavLinkRRD}
              onClick={closeCollapse}
            >
              <i className={prop.icon} />
              {prop.name}
            </NavLink>
          </NavItem>
        );
      });
    } else {
      return (
        <NavItem key={1}>
          <NavLink to="/cliente/index" tag={NavLinkRRD} onClick={closeCollapse}>
            <i className="fas  fa-home text-blue" />
            Index
          </NavLink>
        </NavItem>
      );
    }
  };

  const { bgColor, routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo && logoImg === "" ? (
          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            <img
              alt={logo.imgAlt}
              className="navbar-brand-img"
              src={logoDefault}
            />
          </NavbarBrand>
        ) : (
          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            <img alt={logo.imgAlt} className="navbar-brand-img" src={logoImg} />
          </NavbarBrand>
        )}
        
        {/* User */}
        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <img
                    alt="..."
                    src={urlImagen}
                    style={{
                      width: "40px", // Ajusta el tamaño de acuerdo a tus preferencias
                      height: "40px", // Ajusta el tamaño de acuerdo a tus preferencias
                      objectFit: "cover", // Escala la imagen para ajustarse manteniendo la proporción
                      borderRadius: "50%", // Hace que la imagen sea redonda
                    }}
                  />
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" end>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Opciones</h6>
              </DropdownItem>
              <DropdownItem onClick={handlePerfil}>
                <i className="ni ni-single-02" />
                <span>Mi perfil</span>
              </DropdownItem>

              <DropdownItem divider />
              <DropdownItem onClick={handleCerrarSesion}>
                <i className="ni ni-user-run" />
                <span>Cerrar Sesion</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          {/* Form */}
          <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <Input
                aria-label="Search"
                className="form-control-rounded form-control-prepended"
                placeholder="Search"
                type="search"
              />
            </InputGroup>
          </Form>
          {/* Navigation */}
          <Nav navbar>{createLinks(routes)}</Nav>
          {/* Divider */}
          <hr className="my-3" />
          {/* Heading */}
          <h6 className="navbar-heading  text-center">ENERGY TIME</h6>
          {/* Navigation */}
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
