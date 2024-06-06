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
  Form,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Headers/Header";
import { listaRutinas } from "../../api/Rutinas/Rutinas";
import { saveEntrenamiento } from "../../api/Asistencias/Entrenamiento";
import { useParams } from "react-router-dom";
import "../../assets/css/spinner.css";

const Entrenamientos = () => {
 
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  /*
    #######---Ejercicios----------#################################################################3#######
    */
  //Lista de ejercicios

  const [rutinas, setRutinas] = useState([]);
  const [filtroRutina, setFiltroRutina] = useState("");
  useEffect(() => {
    listadoRutinas();
  }, []);
  const listadoRutinas = () => {
    listaRutinas()
      .then((response) => response.json())
      .then((data) => {
        setRutinas(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Filtro de la tabla
  const filtroRutinas = rutinas.filter((ejercicio) =>
    ejercicio.nombre.toLowerCase().includes(filtroRutina.toLowerCase())
  );
  const usuarioId = JSON.parse(localStorage.getItem("data")).id;
  const [rutina, setRutina] = useState([]);
  const [entrenamiento, setEntrenamiento] = useState({
    asistenciaId: id,
    usuarioId,
  });
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);

  //Actualizar campos del modal
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (checked) {
        if (ejercicioSeleccionado === value) {
          // Si se hace clic en el mismo checkbox, deselecciónalo
          setEjercicioSeleccionado(null);
        } else {
          // Establece el ejercicio seleccionado
          setEjercicioSeleccionado(value);
        }
      } else {
        setEjercicioSeleccionado(value);
      }
    }
    // Para otros campos, simplemente actualizar el valor
    setEntrenamiento((prevEjercicio) => ({ ...prevEjercicio, [name]: value }));
  };

  const registrarEntrenamiento = (e) => {
    
    e.preventDefault();
    setDownloading(true)

    saveEntrenamiento(entrenamiento)
      .then((response) => response.json())
      .then((data) => {
        
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(f=>{
        navigate("/cliente/entrenamientos?save=yes");
        setDownloading(false)
      })
            
  };

  const guardarRutinaSeleccionada = (rutinaId) => {
    setEntrenamiento({ ...entrenamiento, rutinaId });
    if (rutinaId !== null) {
      rutinas.forEach((rutina) => {
      
        if (rutina.id === Number(rutinaId)) {
          setRutina(rutina);
        }
      });
    } else {
      setRutina([]);
    }
  };
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
        {downloading && (
          <div className="overlay">
            <div className="spinner " aria-hidden="true"></div>
          </div>
        )}
        <Card className="my-2 text-justify">
          <CardBody>
            <Row className="align-items-center">
              <div className="col">
                <h3 className="mb-0">REGISTRAR ENTRENAMIENTO</h3>
              </div>
              <div className="col text-right">
                <Link to="/cliente/entrenamientos">
                  <Button
                    color="primary"
                    type="submit"
                    //   onClick={toggleRutina}
                  >
                    <i className="fa fa-arrow-left" />
                  </Button>
                </Link>
              </div>
            </Row>
            <Form
              onSubmit={registrarEntrenamiento}
              //onSubmit={registrarEntrenador}
            >
              {entrenamiento && (
                <Row>
                  

                  <Col lg="12">
                    {rutinas && (
                      <>
                        <FormGroup>
                          <Label
                            for="musculaturaTrabajada"
                            className="form-control-label text-primary"
                          >
                            Rutina
                          </Label>
                          <Input
                            type="select"
                            name="rutinaId"
                            id="rutinaId"
                            className="form-control text-dark fw-bold" // Clase Bootstrap para selects
                            value={entrenamiento.rutinaId} // Establece el valor seleccionado
                            onChange={(e) => {
                              const selectedRutinaId = e.target.value;
                              guardarRutinaSeleccionada(selectedRutinaId);
                            }}
                            required
                          >
                            <option value="">Selecciones una rutina</option>
                            {rutinas.map((rutina) => (
                              <option value={rutina.id}>{rutina.nombre}</option>
                            ))}
                            {/* Agrega más opciones según tus necesidades */}
                          </Input>
                        </FormGroup>
                        {rutina && entrenamiento?.rutinaId !== null ? (
                          <FormGroup>
                            <Label
                              for="musculaturaTrabajada"
                              className="form-control-label text-primary"
                            >
                              Ejercicio
                            </Label>
                            <Row>
                              {rutina?.ejercicios?.map((ejercicio) => (
                                <Col sm="4" key={ejercicio.id}>
                                  <FormGroup check inline className="mt-3 p-3">
                                    <Input
                                      type="radio"
                                      value={ejercicio.id}
                                      name="ejercicioId" // Debe ser el mismo para todos los radios
                                      id={`rutina-${ejercicio.id}`}
                                      onChange={handleChange}
                                      required
                                    />

                                    <Label check className="h3">
                                      {ejercicio.nombre}
                                    </Label>
                                  </FormGroup>
                                  <div className="embed-responsive embed-responsive-16by9">
                                    <iframe
                                      title="YouTube Video"
                                      className="embed-responsive-item"
                                      src={convertToEmbedUrl(ejercicio.video)}
                                      allowFullScreen
                                    ></iframe>
                                  </div>
                                </Col>
                              ))}
                            </Row>
                          </FormGroup>
                        ) : null}
                      </>
                    )}
                  </Col>
                  <Col lg="4">
                    <FormGroup>
                      <label
                        className="form-control-label text-primary"
                        htmlFor="nombre"
                      >
                        Series
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="series"
                        name="series"
                        placeholder="10"
                        value={entrenamiento.series}
                        onChange={handleChange}
                        type="number"
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="4">
                    <FormGroup>
                      <label
                        className="form-control-label text-primary"
                        htmlFor="nombre"
                      >
                        Repeciones
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="repeticiones"
                        name="repeticiones"
                        placeholder="5"
                        value={entrenamiento.repeticiones}
                        onChange={handleChange}
                        type="number"
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="4">
                    <FormGroup>
                      <label
                        className="form-control-label text-primary"
                        htmlFor="nombre"
                      >
                        Peso
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="peso"
                        name="peso"
                        placeholder="25"
                        value={entrenamiento.peso}
                        onChange={handleChange}
                        type="number"
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
              )}

              <Col className="text-center">
                <Button className="text-white" color="default" type="submit">
                  GUARDAR
                </Button>
              </Col>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default Entrenamientos;
