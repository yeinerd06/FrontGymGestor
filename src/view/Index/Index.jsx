import React, { useState,  } from "react";
import {
  Button,
  Row,
  Col,
  CardTitle,
  Container,
  CardImg,
} from "reactstrap";

import { Link } from "react-router-dom";
import Carrusel from "../../components/Carousel/Carrusel";
import "../../assets/css/spinner.css";
import horarioPrev from "../../assets/img/carrusel/horario.jpg";
import "../../assets/css/mensaje.css";

import { FaWhatsapp } from "react-icons/fa";

import { useUserContext } from "../../components/Context/UserContext";

const Index = () => {
  const [downloading, setDownloading] = useState(false);

  const { publicidades, horario, corporativo } = useUserContext();
  const enviarMensajeWhatsapp = () => {
    const numeroTelefono = corporativo?.telefono;
    if (numeroTelefono) {
      const url = `whatsapp://send?phone=${numeroTelefono}`;
      window.open(url, '_blank');
    }
  };
  return (
    <>
      <Container>
        {downloading && (
          <div className="overlay">
            <div className="spinner " aria-hidden="true"></div>
          </div>
        )}

        <Row>
          <Col md="6" className="mt-3">
            {horario === "" ? (
              <img src={horarioPrev} alt="..." className="responsive" />
            ) : (
              <img src={horario} alt="..." className="responsive" />
            )}
          </Col>
          <Col md="6" className="mt-3">
            <Carrusel />
          </Col>

          <hr className="text-primary" />
          <Col sm="12">
            <div className="text-center mt-3 p-5">
              <Row>
                <Col className="col-auto">
                  <div className="icon icon-shape bg-yellow text-primary rounded-circle shadow">
                    <i className="fa fa-map" />
                  </div>
                </Col>
                <div className="col">
                  <CardTitle
                    tag="h5"
                    className="text-uppercase h3 text-dark mb-0 mt-3"
                  >
                    UBICACION
                  </CardTitle>
                </div>
                <div className="col">
                  <Link to={corporativo?.ubicacion} target="_blank">
                    <p className="mt-3 mb-0 text-muted text-sm text-center">
                      <span className="text-primary mr-2">
                        <i className="fa fa-location-arrow " /> VER MAPA
                      </span>
                    </p>
                  </Link>
                </div>
              </Row>
            </div>
          </Col>
          {publicidades.length > 0 && (
            <>
              {publicidades.map((publicidad) => (
                <Col sm="12" className="mt-3" key={publicidad.id}>
                  <CardImg
                    alt="Card image cap"
                    src={publicidad?.foto}
                    style={{
                      height: 270,
                    }}
                    width="100%"
                  />
                </Col>
              ))}
            </>
          )}
          <br />
        </Row>
        <Row>
          <Button className="whatsapp-button" onClick={enviarMensajeWhatsapp}>
            <FaWhatsapp className="h1 mt-1 text-white" />
          </Button>
        </Row>
      </Container>
    </>
  );
};

export default Index;
