import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
// core components
import UserHeader from "../../components/Headers/Header";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useUserContext } from "../../components/Context/UserContext";
import "animate.css";
import "../../assets/css/spinner.css";
import { downloadImagenPerfil } from "../../api/Perfil/Perfil";
import { getEntrenador } from "../../api/Entrenador/Entrenador";
import logoUser from "../../assets/img/user.png";
import { listaUsuarioRolEntrenador } from "../../api/Usuarios/Usuario";
import { updateUsuarioMembresia } from "../../api/Membresia/Membresia";
const Entrenador = () => {
  //Buscar entrenadores
  useEffect(() => {
    listadoEntrenadores();
  }, []);
  //Estado mientra se busca el ente
  const [buscandoEntrenadores, setBuscandoEntrenadores] = useState(false);
  const {
    usuario,
    cliente,
    entrenador,
    membresia,
    fotoEntrenador,
    setFotoEntrenador,
    dataMembresiaActiva,
    setDataMembresiaActiva,
    setEntrenador
  } = useUserContext();

  const [downloading, setDownloading] = useState(false);
  //Modal foto entrenador actual
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  //Moda actualizar entrenador
  const [modalUpdate, setModalUpdate] = useState(false);
  const toggleUpdate = () => setModalUpdate(!modalUpdate);

  const [entrenadores, setEntrenadores] = useState([]);
  const [timeCargaEntrenadores, setTimeCargaEntrenadores] = useState(true);
  //Listado de entrenadores
  const listadoEntrenadores = async () => {
    try {
      //setDownloading(true)
      listaUsuarioRolEntrenador()
        .then((res) => res.json())
        .then((data) => {
          setEntrenadores(data);
        })
        .finally((f) => {
          setTimeCargaEntrenadores(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateEntrenador = (entrenadorUsuario) => {
    Swal.fire({
      title: "Cambiar entrenador?",
      text: "Nuevo entrenador : " + entrenadorUsuario.usuario.nombre,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar!",
    }).then((result) => {
      if (result.isConfirmed) {
        setDownloading(true);

        const usuarioMembresia = {
          id: dataMembresiaActiva.id,
        };

        updateUsuarioMembresia(usuarioMembresia, entrenadorUsuario.usuario.id)
          .then((res) => res.json())
          .then((data) => {
            buscarNuevoEntrenador(data)
            setDataMembresiaActiva(data)
            listadoEntrenadores()
            toggleUpdate();
            Swal.fire({
              title: "Completado!",
              text: "El entrenador se actualizo.",
              icon: "success",
            });
          })
          .catch((e) => {
            Swal.fire({
              title: "Error!",
              text: "Intenta mas tarde.",
              icon: "error",
            });
            console.log(e);
          })
          .finally((f) => {
            toggleUpdate();
            setDownloading(false);
          });
      }
    });
  };

  const buscarNuevoEntrenador=(usuarioMembresia)=>{
    
    getEntrenador(usuarioMembresia.entrenadorId)
      .then((res) => res.json())
      .then((data) => {
        setEntrenador(data);
        if (data.foto !== null) {
          downloadImagenPerfil(data.id, data.foto)
            .then((res) => res.blob())
            .then((blob) => {
              const imageUrl = URL.createObjectURL(blob); // Crea una URL para la imagen descargada.
              // console.log(imageUrl);
              setFotoEntrenador(imageUrl);
            })
            .finally((f) => {
              // setDownloading(false);
            });
        }else{
          setFotoEntrenador(logoUser)
        }
      })
      .catch((err) => {
        console.log(err);
        //setDownloading(false);
      });
  }




  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className="mt--7 " fluid>
        {downloading && (
          <div className="overlay">
            <div className="spinner " aria-hidden="true"></div>
          </div>
        )}
        <Row>
          {membresia && entrenador !== null ? (
            <>
              <Col className="order-xl-1 mt-1" xl="12">
                <Card className="bg-white shadow">
                  <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                      <Col xs="8">
                        <h3 className="mb-0">ENTRENADOR </h3>
                      </Col>
                      <div className="col text-right">
                        <Link title="Cambiar Entrenador">
                          <Button
                            size="sm"
                            color="primary"
                            type="submit"
                            className=" fw-bold"
                            onClick={toggleUpdate}
                          >
                            <i className="fa fa-pencil-square " /> Actualizar
                          </Button>
                        </Link>
                      </div>
                    </Row>
                  </CardHeader>

                  <CardBody>
                    <Row>
                      <Col
                        className="text-center justify-content-center"
                        lg="3"
                        style={{
                          width: "150px", // Ajusta el tamaño de acuerdo a tus preferencias
                          height: "150px", // Ajusta el tamaño de acuerdo a tus preferencias
                        }}
                      >
                        <div className="card-profile-image">
                          <a onClick={toggle}>
                            <img
                              alt="..."
                              className="rounded-circle  mt-5"
                              src={fotoEntrenador}
                              style={{
                                width: "150px", // Ajusta el tamaño de acuerdo a tus preferencias
                                height: "150px", // Ajusta el tamaño de acuerdo a tus preferencias
                                objectFit: "cover", // Escala la imagen para ajustarse manteniendo la proporción
                                borderRadius: "50%", // Hace que la imagen sea redonda
                              }}
                            />
                          </a>
                        </div>
                      </Col>
                      <Col lg="9">
                        <Form>
                          <h6 className="heading-small text-primary h3 fw-bold mb-4">
                            Desde: {membresia[0]?.fechaInicio.slice(0, 10)} -
                            Hasta: {membresia[0]?.fechaFin.slice(0, 10)}
                          </h6>
                          <div className="pl-lg-4">
                            <Row>
                              <Col lg="8">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-username"
                                  >
                                    Nombre
                                  </label>
                                  <Input
                                    className="form-control-alternative text-center text-dark"
                                    defaultValue={entrenador.nombre}
                                    id="nombres"
                                    placeholder="Nombres y Apellidos"
                                    type="text"
                                    disabled
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="4">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-first-name"
                                  >
                                    Telefono
                                  </label>
                                  <Input
                                    className="form-control-alternative text-center text-dark"
                                    value={entrenador.telefono}
                                    id="telefono"
                                    placeholder="telefono"
                                    type="text"
                                    disabled
                                  />
                                </FormGroup>
                              </Col>

                              <Col lg="12">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-email"
                                  >
                                    Correo Electronico
                                  </label>
                                  <Input
                                    className="form-control-alternative text-center text-dark"
                                    id="email"
                                    value={entrenador.email}
                                    type="email"
                                    placeholder="Correo Electronico"
                                    disabled
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </div>
                          {/* <hr className="my-4" /> */}
                        </Form>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <hr />
              </Col>
            </>
          ) : (
            <p>Cargando...</p>
          )}
        </Row>
      </Container>
      //Modal foto de perfil
      <Modal isOpen={modal} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>Foto del Entrenador</ModalHeader>
        <ModalBody>
          <img
            alt="Imagen de perfil"
            src={fotoEntrenador}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              display: "block",
              margin: "auto",
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
      //Modal actualizar entrenador
      <Modal isOpen={modalUpdate} toggle={toggleUpdate} size="lg">
        <ModalHeader toggle={toggleUpdate}>
          <h3>Seleciona el nuevo entrenador</h3>
        </ModalHeader>
        <ModalBody>
          {entrenadores.length > 0 ? (
            <Row>
              {entrenadores.map((entrenadorCurrent) => (
                <div key={entrenadorCurrent.id}>
                  {entrenadorCurrent.usuario.id !== entrenador.id && (
                    <Col className="order-xl-1 mt-1" xl="12">
                      <Card className="bg-white shadow">
                        <CardHeader className="bg-white border-0">
                          <Row className="align-items-center">
                            <Col xs="8">
                              <h3 className="mb-0">ENTRENADOR </h3>
                            </Col>
                            <div className="col text-right">
                              <Link title="Cambiar Entrenador">
                                <Button
                                  size="sm"
                                  color="primary"
                                  type="submit"
                                  className=" fw-bold"
                                  onClick={() =>
                                    updateEntrenador(entrenadorCurrent)
                                  }
                                >
                                  <i
                                    class="fa fa-check-square"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  Selecionar
                                </Button>
                              </Link>
                            </div>
                          </Row>
                        </CardHeader>

                        <CardBody>
                          <Row>
                            <Col
                              className="text-center justify-content-center"
                              lg="3"
                              style={{
                                width: "150px", // Ajusta el tamaño de acuerdo a tus preferencias
                                height: "150px", // Ajusta el tamaño de acuerdo a tus preferencias
                              }}
                            >
                              <div className="card-profile-image">
                                <a
                                //onClick={toggle}
                                >
                                  <img
                                    alt="..."
                                    className="rounded-circle  mt-5"
                                    src={logoUser}
                                    style={{
                                      width: "150px", // Ajusta el tamaño de acuerdo a tus preferencias
                                      height: "150px", // Ajusta el tamaño de acuerdo a tus preferencias
                                      objectFit: "cover", // Escala la imagen para ajustarse manteniendo la proporción
                                      borderRadius: "50%", // Hace que la imagen sea redonda
                                    }}
                                  />
                                </a>
                              </div>
                            </Col>
                            <Col lg="9">
                              <Form>
                                <div className="pl-lg-4">
                                  <Row>
                                    <Col lg="8">
                                      <FormGroup>
                                        <label
                                          className="form-control-label"
                                          htmlFor="input-username"
                                        >
                                          Nombre
                                        </label>
                                        <Input
                                          className="form-control-alternative text-center text-dark"
                                          defaultValue={
                                            entrenadorCurrent.usuario.nombre
                                          }
                                          id="nombres"
                                          placeholder="Nombres y Apellidos"
                                          type="text"
                                          disabled
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col lg="4">
                                      <FormGroup>
                                        <label
                                          className="form-control-label"
                                          htmlFor="input-first-name"
                                        >
                                          Telefono
                                        </label>
                                        <Input
                                          className="form-control-alternative text-center text-dark"
                                          value={
                                            entrenadorCurrent.usuario.telefono
                                          }
                                          id="telefono"
                                          placeholder="telefono"
                                          type="text"
                                          disabled
                                        />
                                      </FormGroup>
                                    </Col>

                                    <Col lg="12">
                                      <FormGroup>
                                        <label
                                          className="form-control-label"
                                          htmlFor="input-email"
                                        >
                                          Correo Electronico
                                        </label>
                                        <Input
                                          className="form-control-alternative text-center text-dark"
                                          id="email"
                                          value={
                                            entrenadorCurrent.usuario.email
                                          }
                                          type="email"
                                          placeholder="Correo Electronico"
                                          disabled
                                        />
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                </div>
                                {/* <hr className="my-4" /> */}
                              </Form>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                      <hr />
                    </Col>
                  )}
                </div>
              ))}
            </Row>
          ) : (
            <p>Cargando ...</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleUpdate}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Entrenador;
