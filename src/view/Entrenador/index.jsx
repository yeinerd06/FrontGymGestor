// reactstrap components
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardText,
  CardTitle,
  Container,
  Row,
  Col,
  CardBody,
  Media,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
  Label,
  Form,
} from "reactstrap";
// core components

import Header from "../../components/Headers/Header";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useEffect } from "react";
import { usuarioMembresiasEntrenador } from "../../api/Membresia/Membresia";
import SpinnerGrupo from "../../components/Sppiner";
import { useUserContext } from "../../components/Context/UserContext";
import {
  customTheme,
  customStyles,
} from "../../components/Datatable/DatatableCustom";
import {
  getMedidasCliente,
  getRutinasDelCliente,
  saveMedidasCliente,
  saveRutinaCliente,
} from "../../api/Medidas/Medidas";

const Index = () => {
  //Columnas de la Datatable
  const {
    clientesEntrenador,
    setClientesEntrenador,
    rutinas,
    ejercicios,
    equipamientos,
  } = useUserContext();
  useEffect(() => {
    setLoading(false);
    if (clientesEntrenador.length > 0) {
      setLoading(false);
    }
  }, [clientesEntrenador]);
  const [loading, setLoading] = useState(true);

  //Columnas de la Datatable Cliente
  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
      wrap: true,
    },
    {
      name: "Cedula",
      cell: (row) => row.cedula,
      selector: (row) => row.cedula,
      sortable: true,
      wrap: true,
    },
    {
      name: "Telefono",
      cell: (row) => row.telefono,
      selector: (row) => row.telefono,
      sortable: true,
      wrap: true,
    },
    {
      name: "Email",
      cell: (row) => row.email,
      selector: (row) => row.email,
      sortable: true,
      wrap: true,
    },

    {
      name: "Medidas",
      cell: (row) => (
        <div className=" d-flex justify-content-end">
          <h3>
            <Link
              className="text-primary h1"
              title="Informacion"
              onClick={() => {
                buscarMedidasCliente(row);

                buscarRutinasCliente(row);
              }}
            >
              {" "}
              <i className="fa fa-male " />
            </Link>
          </h3>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  //Columnas de la Datatable Medidas
  const columnsMedidas = [
    {
      name: "Estatura",
      cell: (row) => row.estatura + " m",
      selector: (row) => row.estatura,
      sortable: true,
      wrap: true,
    },
    {
      name: "Peso",
      cell: (row) => row.peso + " kg",
      selector: (row) => row.peso,
      sortable: true,
      wrap: true,
    },
    {
      name: "Antebrazo",
      selector: (row) => row.tamAntebrazo + " cm",
      sortable: true,
      wrap: true,
    },
    {
      name: "Brazo",
      cell: (row) => row.tamBrazo + " cm",
      selector: (row) => row.tamBrazo,
      sortable: true,
      wrap: true,
    },
    {
      name: "Gemelo",
      cell: (row) => row.tamGemelo + " cm",
      selector: (row) => row.tamGemelo,
      sortable: true,
      wrap: true,
    },
    {
      name: "Glueo",
      cell: (row) => row.tamGluteo + " cm",
      selector: (row) => row.tamGluteo,
      sortable: true,
      wrap: true,
    },
    {
      name: "Pectoral",
      cell: (row) => row.tamPectoral + " cm",
      selector: (row) => row.tamPectoral,
      sortable: true,
      wrap: true,
    },
    {
      name: "Pierna",
      cell: (row) => row.tamPierna + " cm",
      selector: (row) => row.tamPierna,
      sortable: true,
      wrap: true,
    },
    {
      name: "Fecha",
      cell: (row) => row.fechaRegistro.split("T")[0],
      selector: (row) => row.fechaRegistro.split("T")[0],
      sortable: true,
      wrap: true,
    },
  ];
  //Columnas de la Datatable Rutinas
  const columnsRutinas = [
    {
      name: "Nombre",
      selector: (row) => row.rutinaId.nombre,
      sortable: true,
      wrap: true,
    },
    {
      name: "Descripcion",
      cell: (row) => row.rutinaId.descripcion,
      selector: (row) => row.rutinaId.descripcion,
      sortable: true,
      wrap: true,
    },
    {
      name: "Duracion",
      cell: (row) => row.rutinaId.duracion,
      selector: (row) => row.rutinaId.duracion,
      sortable: true,
      wrap: true,
    },
  ];

  //Activar spinner
  const [downloading, setDownloading] = useState(false);
  //Lista de medidas del cliente
  const [medidasCliente, setMedidasCliente] = useState([]);
  //Ultima medida del cliente
  const [medida, setMedida] = useState([]);
  //Informacion de un cliente
  const [infoCliente, setInfoCliente] = useState([]);
  //Estado para cambiar vista ver merdidas cliente
  const [verMedidas, setVerMedidas] = useState(false);
  //Modal para registrar medidas
  const [modal, setModal] = useState(false);
  const toggle = () => {setModal(!modal)
    };
  //Modal para registrar rutinas
  const [modalRutina, setModalRutina] = useState(false);
  const toggleRutina = () => setModalRutina(!modalRutina);
  //Actualizar campos del modal
  const handleChange = (e) => {
    const { name, value } = e.target;

    setMedida((prevMedida) => ({ ...prevMedida, [name]: value }));
  };
  //Funcion para buscar la lista de medidas del cliente
  const buscarMedidasCliente = (usuario) => {
    setDownloading(true);
    getMedidasCliente(usuario.id)
      .then((res) => res.json())
      .then((data) => {
        setInfoCliente(usuario);

        setVerMedidas(true);
        console.log(data);
        if (data.length > 0) {
          setMedida(data[data.length - 1]);
        }
        setMedidasCliente(data.reverse());
      })
      .catch((e) => {
        console.log(e);
      })
      .finally((f) => {
        setDownloading(false);
      });
  };
  //Lista de rutinas del cliente
  const [rutinasCliente, setRutinasCliente] = useState([]);
  const saveMedidas = (e) => {
    e.preventDefault();
    setDownloading(true);
    medida.id = null;
    const idEntrenador = JSON.parse(localStorage.getItem("data")).id;
    medida.entrenador = {
      id: idEntrenador,
    };
    medida.usuario={
      id:infoCliente.id
    }
    saveMedidasCliente(medida)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        buscarMedidasCliente(infoCliente);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally((f) => {
        toggle();
        setDownloading(false);
      });
  };
  const [rutinasFaltantes, setRutinasFaltantes] = useState([]);
  //Funcion para buscar la lista de rutinas del cliente
  const buscarRutinasCliente = (usuario) => {
    getRutinasDelCliente(usuario.id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log(rutinas);

        // Filtrar las rutinas que el usuario no tiene registradas
        const buscandoRutinasFaltantes = rutinas.filter((rutina) => {
          return !data.some(
            (usuarioRutina) => usuarioRutina.rutinaId.id === rutina.id
          );
        });
        setRutinasFaltantes(buscandoRutinasFaltantes);

        setRutinasCliente(data.reverse());
      })
      .catch((e) => {
        console.log(e);
      })
      .finally((f) => {});
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

  const handlesaveRutinaCliente = (rutina) => {
    setDownloading(true)
    const usuarioRutina = {
      rutinaId: {
        id: rutina.id,
      },
      usuarioId: infoCliente.id,
    };
    saveRutinaCliente(usuarioRutina)
      .then((res) => res.json())
      .then((data) => {
        

        buscarRutinasCliente(infoCliente);
      })
      .catch((e) => {
        console.log(e)
      })
      .finally(f=>{
        setDownloading(false)
        toggleRutina();
      })

  };
  return (
    <>
      <Header />
      {/* Page content */}

      <Container className="mt--7" fluid>
        {/* Contenido Cards Problemas Practiva Completadas Otros*/}

        <br />
        {/* Tabla*/}
        <Row>
          {downloading && (
            <div className="overlay">
              <div className="spinner " aria-hidden="true"></div>
            </div>
          )}
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              {loading ? (
                <SpinnerGrupo />
              ) : (
                <>
                  {!verMedidas ? (
                    <>
                      <CardHeader className="border-0">
                        <Row className="align-items-center">
                          <div className="col">
                            <h3 className="mb-0">
                              LISTA DE CLIENTES - Items :{" "}
                              {clientesEntrenador.length}{" "}
                            </h3>
                          </div>
                          <div className="col text-right"></div>
                        </Row>
                      </CardHeader>
                      <CardBody>
                        <DataTable
                          columns={columns}
                          theme={customTheme}
                          customStyles={customStyles}
                          data={clientesEntrenador}
                          striped
                          pointerOnHover
                          responsive
                          sortActive
                          sortDirection
                          highlightOnHover
                          search // Activa la búsqueda
                          noDataComponent="No se encontraron registros para mostrar."
                          pagination // Activa la paginación
                          paginationComponentOptions={{
                            rowsPerPageText: "Filas por página:",
                            rangeSeparatorText: "de",
                            selectAllRowsItem: true,
                            selectAllRowsItemText: "Todos",
                            selectAllRowsItemShow: true,
                          }}
                        />
                      </CardBody>
                    </>
                  ) : (
                    <>
                      <CardHeader className="border-0">
                        <Row className="align-items-center">
                          <div className="col">
                            <h3 className="mb-0">MEDIDAS DEL CLIENTES </h3>
                          </div>
                          <div className="col text-right">
                            <Button
                              className="my-0 text-white"
                              type="button"
                              color="primary"
                              onClick={() => {setVerMedidas(!verMedidas); setMedida([])}}
                              title="Atras"
                            >
                              <i
                                class="fa fa-arrow-left"
                                aria-hidden="true"
                              ></i>
                            </Button>
                          </div>
                        </Row>
                      </CardHeader>
                      <CardBody>
                        {infoCliente && (
                          <Row>
                            <Col xl="6">
                              <CardTitle
                                tag="h3"
                                className=" text-primary mb-0"
                              >
                                Cliente
                              </CardTitle>
                              <CardText className="text-dark fw-bold">
                                {infoCliente.nombre}
                              </CardText>
                            </Col>
                            <Col xl="3">
                              <CardTitle
                                tag="h3"
                                className=" text-primary mb-0"
                              >
                                Cedula
                              </CardTitle>
                              <CardText className="text-dark fw-bold">
                                {infoCliente.cedula}
                              </CardText>
                            </Col>
                            <Col xl="2">
                              <CardTitle
                                tag="h3"
                                className=" text-primary mb-0"
                              >
                                Telefono
                              </CardTitle>
                              <CardText className="text-dark fw-bold">
                                {infoCliente.telefono}
                              </CardText>
                            </Col>
                            <Col xl="1">
                              <Button
                                className="my-0 text-white"
                                type="button"
                                color="primary"
                                title="Registrar"
                                onClick={toggle}
                              >
                                <i class="fa fa-plus" aria-hidden="true"></i>
                              </Button>
                            </Col>
                            <Col xl="12 mt-3">
                              <DataTable
                                columns={columnsMedidas}
                                theme={customTheme}
                                customStyles={customStyles}
                                data={medidasCliente}
                                striped
                                pointerOnHover
                                responsive
                                sortActive
                                sortDirection
                                highlightOnHover
                                search // Activa la búsqueda
                                noDataComponent="No se encontraron registros para mostrar."
                                pagination // Activa la paginación
                                paginationComponentOptions={{
                                  rowsPerPageText: "Filas por página:",
                                  rangeSeparatorText: "de",
                                  selectAllRowsItem: true,
                                  selectAllRowsItemText: "Todos",
                                  selectAllRowsItemShow: true,
                                }}
                              />
                            </Col>
                          </Row>
                        )}
                      </CardBody>
                      <CardHeader className="border-0">
                        <Row className="align-items-center">
                          <div className="col">
                            <h3 className="mb-0">RUTINAS DEL CLIENTES </h3>
                          </div>
                          <div className="col text-right">
                            <Button
                              className="my-0 text-white"
                              type="button"
                              color="primary"
                              onClick={toggleRutina}
                              title="Registrar rutina"
                            >
                              <i class="fa fa-plus" aria-hidden="true"></i>
                            </Button>
                          </div>
                        </Row>
                      </CardHeader>
                      <CardBody>
                        <DataTable
                          columns={columnsRutinas}
                          theme={customTheme}
                          customStyles={customStyles}
                          data={rutinasCliente}
                          striped
                          pointerOnHover
                          responsive
                          sortActive
                          sortDirection
                          highlightOnHover
                          search // Activa la búsqueda
                          noDataComponent="No se encontraron registros para mostrar."
                          pagination // Activa la paginación
                          paginationComponentOptions={{
                            rowsPerPageText: "Filas por página:",
                            rangeSeparatorText: "de",
                            selectAllRowsItem: true,
                            selectAllRowsItemText: "Todos",
                            selectAllRowsItemShow: true,
                          }}
                        />
                      </CardBody>
                    </>
                  )}
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal isOpen={modal} toggle={toggle} size="lg">
        <Form onSubmit={saveMedidas}>
          <ModalHeader toggle={toggle}>
            <h3>Registrar Medidas del cliente</h3>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col lg="6">
                <FormGroup>
                  <label
                    className="form-control-label fw-bold text-primary"
                    htmlFor="nombre"
                  >
                    Estatura (Metros)
                  </label>
                  <Input
                    className="form-control-alternative fw-bold text-dark"
                    id="estatura"
                    name="estatura"
                    placeholder="Marlon"
                    value={medida.estatura}
                    onChange={handleChange}
                    type="number"
                    required
                  />
                </FormGroup>
              </Col>

              <Col lg="6">
                <FormGroup>
                  <label
                    className="form-control-label fw-bold text-primary"
                    htmlFor="email"
                  >
                    Peso (kilogramos)
                  </label>
                  <Input
                    className="form-control-alternative fw-bold text-dark"
                    id="peso"
                    name="peso"
                    placeholder="55"
                    type="number"
                    value={medida.peso}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col lg="4">
                <FormGroup>
                  <label
                    className="form-control-label fw-bold text-primary"
                    htmlFor="email"
                  >
                    Antebrazo (cm)
                  </label>
                  <Input
                    className="form-control-alternative fw-bold text-dark"
                    id="tamAntebrazo"
                    name="tamAntebrazo"
                    placeholder="15.2"
                    type="number"
                    value={medida.tamAntebrazo}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col lg="4">
                <FormGroup>
                  <label
                    className="form-control-label fw-bold text-primary"
                    htmlFor="email"
                  >
                    Brazo (cm)
                  </label>
                  <Input
                    className="form-control-alternative fw-bold text-dark"
                    id="tamBrazo"
                    name="tamBrazo"
                    placeholder="15.2"
                    type="number"
                    value={medida.tamBrazo}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col lg="4">
                <FormGroup>
                  <label
                    className="form-control-label fw-bold text-primary"
                    htmlFor="email"
                  >
                    Gemelo (cm)
                  </label>
                  <Input
                    className="form-control-alternative fw-bold text-dark"
                    id="tamGemelo"
                    name="tamGemelo"
                    placeholder="15.2"
                    type="number"
                    value={medida.tamGemelo}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col lg="4">
                <FormGroup>
                  <label
                    className="form-control-label fw-bold text-primary"
                    htmlFor="email"
                  >
                    Gluteo (cm)
                  </label>
                  <Input
                    className="form-control-alternative fw-bold text-dark"
                    id="tamGluteo"
                    name="tamGluteo"
                    placeholder="15.2"
                    type="number"
                    value={medida.tamGluteo}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col lg="4">
                <FormGroup>
                  <label
                    className="form-control-label fw-bold text-primary"
                    htmlFor="email"
                  >
                    Pectorales (cm)
                  </label>
                  <Input
                    className="form-control-alternative fw-bold text-dark"
                    id="tamPectoral"
                    name="tamPectoral"
                    placeholder="15.2"
                    type="number"
                    value={medida.tamPectoral}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col lg="4">
                <FormGroup>
                  <label
                    className="form-control-label fw-bold text-primary"
                    htmlFor="email"
                  >
                    Pierna (cm)
                  </label>
                  <Input
                    className="form-control-alternative fw-bold text-dark"
                    id="tamPierna"
                    name="tamPierna"
                    placeholder="15.2"
                    type="number"
                    value={medida.tamPierna}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="default" onClick={toggle}>
              Cerrar
            </Button>
            <Button color="primary" type="submit">
              Guardar
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
      <Modal isOpen={modalRutina} toggle={toggleRutina} size="lg">
        <Form onSubmit={saveMedidas}>
          <ModalHeader toggle={toggleRutina}>
            <h3>Registrar Rutinas del cliente</h3>
          </ModalHeader>
          <ModalBody>
            {rutinas && (
              <div>
                {rutinasFaltantes.map((rutina, index) => (
                  <>
                    <CardTitle tag="h1" className="text">
                      <Row className="aling-items-center">
                        <div className="col  ">
                          <h3 className="mb-0 mt-3 text-dark fw-bold d-flex">
                            
                           {rutina.nombre.toUpperCase()}
                          </h3>
                        </div>
                        <div className="col text-right">
                          <Link title="Actualizar">
                            <Button
                              className="fw-bold h2"
                              color="primary"
                              type="submit"
                              onClick={() => handlesaveRutinaCliente(rutina)}
                            >
                              <i className="fa fa-check" />{" "}
                            </Button>
                          </Link>
                        </div>
                      </Row>
                    </CardTitle>
                    <Row>
                      <Col lg="6">
                        <CardTitle tag="h3" className=" text-primary mb-0">
                          Musculo a trabajar
                        </CardTitle>
                        <CardText className="text-dark fw-bold">
                          {rutina?.musculo?.toUpperCase()}
                        </CardText>
                      </Col>
                      <Col lg="6">
                        <CardTitle tag="h3" className=" text-primary mb-0">
                          Duracion
                        </CardTitle>
                        <CardText className="text-dark fw-bold">
                          {rutina.duracion}
                        </CardText>
                      </Col>
                      <Col lg="12">
                        <CardTitle tag="h3" className=" text-primary mb-0">
                          Descripcion
                        </CardTitle>
                        <CardText className="text-dark fw-bold">
                          {rutina.descripcion}
                        </CardText>
                      </Col>
                    </Row>

                    {rutina.ejercicios?.map((ejercicio) => (
                      <Row key={ejercicio.id}>
                        <Col sm="12">
                          <h3 className="mb-0 mt-3 text-dark fw-bold">
                            <span className="form-control-label text-primary">
                              Ejercicio :
                            </span>{" "}
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
                              {ejercicio.equipamientos?.map((equipameinto) => (
                                <li>{equipameinto.nombre}</li>
                              ))}
                            </ul>
                          </CardText>
                        </Col>
                      </Row>
                    ))}
                    <hr />
                  </>
                ))}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" onClick={toggleRutina}>
              Cerrar
            </Button>
            <Button color="primary" type="submit">
              Guardar
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default Index;
