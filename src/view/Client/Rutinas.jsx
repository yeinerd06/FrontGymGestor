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
} from "reactstrap";
import { Link } from "react-router-dom";
import Header from "../../components/Headers/Header";
import { listaRutinas } from "../../api/Rutinas/Rutinas";
import SpinnerGrupo from "../../components/Sppiner";
import { useUserContext } from "../../components/Context/UserContext";

const Rutinas = () => {
  /*
    #######---RUTINAS----------#################################################################3#######
    */
  //Lista de rutinas
  const [loading, setLoading] = useState(false);
  const { rutinasCliente, setRutinas, rutinas } = useUserContext();

  // useEffect(() => {
  //   listadoRutinas();
  // }, []);

  // //Busco la lista de rutinas
  // const listadoRutinas = async () => {
  //   listaRutinas()
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setLoading(false);
  //       setRuntinas(data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  const [filtroRutina, setFiltroRutina] = useState("");
  //Filtro de la tabla
  const filtroRutinas = rutinasCliente.filter(
    (rutina) =>
      rutina.rutinaId.nombre.toLowerCase().includes(filtroRutina.toLowerCase())
    //
  );

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
                  LISTA DE RUTINAS - Items : {rutinasCliente.length}
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
                  placeholder="Ingrese el Nombre de la Rutina..."
                  value={filtroRutina}
                  onChange={(e) => setFiltroRutina(e.target.value)}
                />
              </Col>
            </FormGroup>
          </CardBody>
        </Card>
        {loading ? ( // Muestra el mensaje de carga si loading es verdadero
          <Card className="my-2 text-center">
            <CardBody className="">
              <>
                <div class="spinner-grow text-primary" role="status">
                  <span class="visually-hidden">C</span>
                </div>

                <div class="spinner-grow text-yellow" role="status">
                  <span class="visually-hidden">A</span>
                </div>
                <div class="spinner-grow text-danger" role="status">
                  <span class="visually-hidden">R</span>
                </div>
                <div class="spinner-grow text-primary" role="status">
                  <span class="visually-hidden">G</span>
                </div>
                <div class="spinner-grow text-info" role="status">
                  <span class="visually-hidden">A</span>
                </div>
              </>
            </CardBody>
          </Card>
        ) : (
          <>
            {rutinasCliente && (
              <div>
                {filtroRutinas.map((rutina) => (
                  <>
                    <Card
                      className="my-2 text-justify"
                      //   color="primary"
                      //   outline
                      key={rutina.rutinaId.id}
                    >
                      <CardBody>
                        <CardTitle tag="h1" className="text">
                          <Row className="aling-items-center">
                            <div className="col  ">
                              <h3 className="mb-0 mt-3 text-dark fw-bold">
                                  RUTINA {" "}
                                
                                {rutina.rutinaId.nombre.toUpperCase()}
                              </h3>
                            </div>
                          </Row>
                        </CardTitle>
                        <Row>
                          <Col lg="6">
                            <CardTitle tag="h3" className=" text-primary mb-0">
                              Musculo a trabajar
                            </CardTitle>
                            <CardText className="text-dark fw-bold">
                              {rutina?.rutinaId.musculo?.toUpperCase()}
                            </CardText>
                          </Col>
                          <Col lg="6">
                            <CardTitle tag="h3" className=" text-primary mb-0">
                              Duracion
                            </CardTitle>
                            <CardText className="text-dark fw-bold">
                              {rutina.rutinaId.duracion}
                            </CardText>
                          </Col>
                          <Col lg="12">
                            <CardTitle tag="h3" className=" text-primary mb-0">
                              Descripcion
                            </CardTitle>
                            <CardText className="text-dark fw-bold">
                              {rutina.rutinaId.descripcion}
                            </CardText>
                          </Col>
                        </Row>

                        {rutina.rutinaId.ejercicios?.map((ejercicio) => (
                          <Row key={ejercicio.id}>
                            <Col sm="12">
                              <h3 className="mb-0 mt-3 text-dark fw-bold">
                                <span className="form-control-label text-primary">
                                  Ejercicio :{" "}
                                </span>
                                {ejercicio.nombre}
                              </h3>
                            </Col>
                            <Col sm="6">
                              <div className="embed-responsive embed-responsive-16by9">
                                <iframe
                                  title="YouTube Video"
                                  className="embed-responsive-item"
                                  src={convertToEmbedUrl(ejercicio.video)}
                                  allowFullScreen
                                ></iframe>
                              </div>
                              <CardText>
                                <small className="text-muted">
                                  <a href={ejercicio.video}>
                                    Link Video : {ejercicio.video}
                                  </a>
                                </small>
                              </CardText>
                            </Col>
                            <Col sm="6">
                              <CardText className="text-dark fw-bold">
                                <span className="form-control-label text-primary">
                                  Instrucciones :
                                </span>{" "}
                                {ejercicio.instrucciones}
                              </CardText>
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
                        ))}
                      </CardBody>
                    </Card>

                    <hr className="bg-dark" />
                  </>
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Rutinas;
