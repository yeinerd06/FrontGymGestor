import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "../components/Navbars/AdminNavbar";
import AdminFooter from "../components/Footers/AdminFooter";
import Sidebar from "../components/Sidebar/AdminSidebar";
import routes from "../routes";
// Importa la imagen usando import
import logoImg from "../assets/img/brand/logo.png";
import {UserProvider} from "../components/Context/UserContext"

const Director = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  //Filtro las rutas para el modulo director
  const rutasFiltradas = routes.filter((ruta) => ruta.layout === "/admin" && ruta.icon!=="")
  
  return (
    <>
    <UserProvider>
      <Sidebar
        {...props}
       
        routes={rutasFiltradas}
        logo={{
          innerLink: "/admin/index",
          imgSrc: logoImg, // Usamos la variable importada aquí
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/usuario/index" replace />} />
        </Routes>
        
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
      </UserProvider>
    </>
  );
};

export default Director;
