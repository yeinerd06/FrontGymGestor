import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  CardHeader,
  CardTitle,
  CardText,
  Container,
  Modal,
  CardFooter,
  Label,
  FormGroup,
  Input,
  Placeholder,
} from "reactstrap";
import { Link } from "react-router-dom";
import Header from "../../components/Headers/Header";
import { listaEjercicios } from "../../api/Rutinas/Ejercicios";
import { MagicMotion } from "react-magic-motion";
import { useUserContext } from "../../components/Context/UserContext";

const Rutinas = () => {

  const {ejercicios,setEjercicios}=useUserContext()
  /*
    #######---Ejercicios----------#################################################################3#######
    */
  //Lista de ejercicios
  const [loading, setLoading] = useState(false);
  //const [ejercicios, setEjercicios] = useState([]);
  const [filtroEjercicio, setFiltroEjercicio] = useState("");
  // useEffect(() => {
  //   listadoEjercicios();
  // }, []);

  // const listadoEjercicios = () => {
    
  //   listaEjercicios()
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setLoading(false);
  //       setEjercicios(data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  //Filtro de la tabla
  const filtroEjercicios = ejercicios.filter((ejercicio) =>
    ejercicio.nombre.toLowerCase().includes(filtroEjercicio.toLowerCase())
  );

  const [ejercicio, setEjercicio] = useState({
    nombre: "",
    descripcion: "",
    tipoEjercicio: "",
    musculaturaTrabajada: "",
    instrucciones: "",
    video: "",
    equipamientos: [], // Agregar un array para guardar
  });

  //Convertir url del video
  const convertToEmbedUrl = (url) => {
    // Expresión regular para encontrar el ID del video en una URL de YouTube
    const regExp = /(?:\?v=|\/embed\/|\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;

    // Intenta hacer coincidir la URL con la expresión regular
    const match = url.match(regExp);

    if (match) {
      // Si se encuentra una coincidencia, el ID del video estará en match[1]
      const videoId = match[1];
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return embedUrl;
    }

    // Si no se encuentra una coincidencia, devuelve la URL original
    return url;
  };
  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Card className="my-2 text-justify">
          <CardBody>
            <Row className="align-items-center">
              <div className="col">
                <h3 className="mb-0">
                  LISTA DE EJERCICIOS - Items : {ejercicios.length}
                </h3>
              </div>
            </Row>
            <FormGroup row className="justify-content-end mr-2 mt-3">
              <Label
                for="filtro"
                sm={3}
                className="form-control-label text-primary"
              >
                Buscar :
              </Label>

              <Col sm={9}>
                <Input
                  type="text"
                  className="text-dark fw-bold"
                  placeholder="Ingrese el Nombre del Ejercicio..."
                  value={filtroEjercicio}
                  onChange={(e) => setFiltroEjercicio(e.target.value)}
                />
              </Col>
            </FormGroup>
          </CardBody>
        </Card>
        {loading ? ( // Muestra el mensaje de carga si loading es verdadero
          <Card className="my-2 text-center">
            <CardBody>
              <>
                <div class="spinner-grow text-primary" role="status">
                  <span class="visually-hidden"></span>
                </div>
                
                <div class="spinner-grow text-success" role="status">
                  <span class="visually-hidden"></span>
                </div>
                <div class="spinner-grow text-danger" role="status">
                  <span class="visually-hidden"></span>
                </div>
                <div class="spinner-grow text-warning" role="status">
                  <span class="visually-hidden"></span>
                </div>
                <div class="spinner-grow text-info" role="status">
                  <span class="visually-hidden"></span>
                </div>
               
               
              </>
            </CardBody>
          </Card>
        ) : (
          <>
          <MagicMotion>
            {ejercicios && (
              <>
                {filtroEjercicios.map((ejercicio) => (
                  <>
                    <Card
                      className="my-2 text-justify"
                      //   color="primary"
                      //   outline
                      key={ejercicio.id}
                    >
                      <CardBody>
                        <CardTitle tag="h1" className="text">
                          <Row className="aling-items-center">
                            <div className="col  ">
                              <h3 className="mb-0 mt-3 text-dark">
                                <span className="form-control-label text-primary">
                                  Ejercicio:{" "}
                                </span>
                                {ejercicio.nombre.toUpperCase()}
                              </h3>
                            </div>
                          </Row>
                        </CardTitle>
                        <CardText className="text-dark fw-bold">
                          <span className="form-control-label text-primary">
                            Descripcion:{" "}
                          </span>
                          {ejercicio.descripcion}
                        </CardText>
                        <Row>
                          <Col sm="6">
                            <CardText className="text-dark fw-bold">
                              <span className="form-control-label text-primary">
                                {" "}
                                Tipo de ejercicio:
                              </span>{" "}
                              {ejercicio.tipoEjercicio.toUpperCase()}
                            </CardText>
                          </Col>
                          <Col sm="6">
                            <CardText className="text-dark fw-bold">
                              <span className="form-control-label text-primary">
                                Musculatura a trabajar :{" "}
                              </span>
                              {ejercicio.musculaturaTrabajada.toUpperCase()}
                            </CardText>
                          </Col>
                        </Row>
                        <CardText className="text-dark fw-bold">
                          <span className="form-control-label text-primary">
                            Instrucciones :
                          </span>{" "}
                          {ejercicio.instrucciones}
                        </CardText>

                        <CardText className="text-dark fw-bold">
                          <small className="text-muted">
                            <a href={ejercicio.video}  target="_blank">
                              Link Video : {ejercicio.video}
                            </a>
                          </small>
                        </CardText>
                        <Row>
                          <Col sm="6">
                            <div className="embed-responsive embed-responsive-16by9">
                              <iframe
                                title="YouTube Video"
                                className="embed-responsive-item"
                                src={convertToEmbedUrl(ejercicio.video)}
                                allowFullScreen
                              ></iframe>
                            </div>
                          </Col>
                          <Col sm="6">
                            <CardText className="text-dark fw-bold">
                              <span className="form-control-label text-primary">
                                Equipamientos :
                              </span>
                              <ul>
                                {ejercicio.equipamientos?.map(
                                  (equipameinto) => (
                                    <li>{equipameinto.nombre}</li>
                                  )
                                )}
                              </ul>
                            </CardText>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>

                    <hr className="bg-dark" />
                  </>
                ))}
              </>
            )}
            </MagicMotion>
          </>
        )}
      </Container>
    </>
  );
};

export default Rutinas;
