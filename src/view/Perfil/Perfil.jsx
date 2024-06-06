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
import {
  saveImagenPerfil,
  downloadImagenPerfil,
  updatePerfil,
} from "../../api/Perfil/Perfil";

const Perfil = () => {
 
  const [tieneImagen, setTieneImagen] = useState(false);
  const {
    urlImagen,
    setUrlImagen,
    usuario,
    setUsuario,
    membresiaActiva,
    cliente,
    fechaInicio,
    fechaFin,
  } = useUserContext();
  
  const [downloading, setDownloading] = useState(false);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
 

  const handleSubirImagen = async () => {
    try {
      const { value: file } = await Swal.fire({
        title: "Seleccionar imagen",
        padding: "3em",
        color: "#0a6fba",
        confirmButtonColor: "#0a6fba",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
        confirmButtonText: 'Siguiente <i class="fa fa-arrow-right"></i>',
        input: "file",
        inputAttributes: {
          accept: "image/*",
          "aria-label": "Upload your profile picture",
        },
      });

      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          Swal.fire({
            imageUrl: e.target.result,
            imageAlt: "...",
            showCancelButton: true,
            confirmButtonColor: "#0a6fba",
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
          }).then(async (result) => {
            if (result.isConfirmed) {
              setDownloading(true);
              const formDataFile = new FormData();
              formDataFile.append("file", file); // Usar 'file' en lugar de e.target.result

              try {
                const response = await saveImagenPerfil(
                  usuario.id,
                  formDataFile
                );
                if (response.ok) {
                  setUrlImagen(e.target.result)
                  const data = await response.json();
                  setUsuario(data);
                  setTieneImagen(false);
                  
                  setDownloading(false);
                  Swal.fire({
                    icon: "success",
                    title: "¡Completado!",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                } else {
                  setDownloading(false);
                }
              } catch (err) {
                setDownloading(false);
                console.error("Error:", err);
              }
            }
          });
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getImagenPerfil = async () => {
    try {
      const tieneImagen = usuario.foto ? true : false;
      if (tieneImagen) {
        const response = await downloadImagenPerfil(usuario.id, usuario.foto);

        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob); // Crea una URL para la imagen descargada
          setUrlImagen(imageUrl);
        } else {
          console.log("error buscando imagen");
        }
      }
    } catch (error) {}
  };
  const modulo = localStorage.getItem("modulo");
  var estadoMembresia = membresiaActiva ? "ACTIVA" : "FALSE";
  const calcularDiferenciaEnDias = (fecha2) => {
    // Parsea las fechas en objetos Date
    const fechaInicio = new Date();
    const fechaFin = new Date(fecha2);

    // Calcula la diferencia en milisegundos
    const diferenciaEnMilisegundos = fechaFin - fechaInicio;

    // Convierte la diferencia en días
    const diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);

    return Math.abs(Math.round(diferenciaEnDias))+1; // Usamos Math.abs para asegurarnos de que la diferencia sea positiva
  };
  //Guardo el usuario en la const usuarioNew
  useEffect(()=>{
    if(usuario!==null){
      setUsuarioNew(usuario)
    }
  },[usuario])
  const [usuarioNew,setUsuarioNew]=useState(usuario)
  //Habilito los input 
  const [disabledInputs, setDisabledInputs] = useState(true); // Estado para controlar la propiedad disabled
  const handleHabilitarCampos = () => {
    //alert("Actualizar")
    setDisabledInputs(!disabledInputs);
    setUsuarioNew(usuario)
  };
  const handleActualizarPerfil=(e)=>{
    e.preventDefault();
    setDownloading(true)
    const user={
      id:usuarioNew.id,
      nombre:usuarioNew.nombre,
      telefono:usuarioNew.telefono,
      cedula:usuarioNew.cedula,
      email:usuarioNew.email,
      fechaNacimiento:usuarioNew.fechaNacimiento.slice(0,10)
      
    }
    updatePerfil(user)
    .then(res=>res.json())
    .then(data=>{
      setUsuario(data)
      setUsuarioNew(data)
      setDisabledInputs(!disabledInputs)
      Swal.fire({
        icon: "success",
        title: "Actualizado!",
        showConfirmButton: false,
        timer: 1500,
      });
    })
    .catch(err=>{
      console.log(err)
    })
    .finally(f=>{
      setDownloading(false)
    })
  }

   //Actualizar campos del form
   const handleChange = (e) => {
    const { name, value } = e.target;

    setUsuarioNew((prevEntrenador) => ({ ...prevEntrenador, [name]: value }));
  };
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
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a onClick={toggle}>
                      <img
                        alt="..."
                        className="rounded-circle "
                        src={urlImagen}
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
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-end mr-5">
                  <Button
                    className="float-right"
                    color="primary"
                    onClick={handleSubirImagen}
                    size="sm"
                    title="Actualizar foto de perfil"
                  >
                    <i class="fa-regular fa-pen-to-square"></i>
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-3">
                      <div className="pl-lg-4">
                        {membresiaActiva ? (
                          <>
                            <h6 className="heading-small text-dark mb-4">
                              Informacion de la Membresia
                            </h6>
                            <Row>
                              <Col md="12">
                                <FormGroup>
                                  {/* <label
                                    className="form-control-label"
                                    htmlFor="input-address"
                                  >
                                    Estado Membresia
                                  </label> */}

                                  <Input
                                    className="form-control text-center text-dark boder border-success fw-bold"
                                    value={estadoMembresia}
                                    id="estadoMatricula"
                                    placeholder="Estado Matricula"
                                    type="text"
                                    disabled
                                  />
                                </FormGroup>
                              </Col>
                              <Col md="6">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-address"
                                  >
                                    Fecha Inicio
                                  </label>
                                  <Input
                                    className="form-control-alternative text-center text-dark"
                                    value={
                                      fechaInicio?.fechaInicio?.split("T")[0]
                                    }
                                    id="semestre"
                                    placeholder="Semestre"
                                    type="text"
                                    disabled
                                  />
                                </FormGroup>
                              </Col>
                              <Col md="6">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-address"
                                  >
                                    Fecha Fin
                                  </label>
                                  <Input
                                    className="form-control-alternative text-center text-dark"
                                    value={fechaFin?.fechaFin?.split("T")[0]}
                                    id="pensum"
                                    placeholder="Pensum"
                                    type="text"
                                    disabled
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <div className="text-center align-items-center">
                              <p className="text-center text-dark fw-bold h4">
                                {calcularDiferenciaEnDias(fechaFin?.fechaFin)}{" "}
                                Dias
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <h6 className="heading-small text-muted mb-4">
                              Imagen de perfil
                            </h6>
                            <Row>
                              <Col md="12" className="mt-3 p-1">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-address"
                                  >
                                    MODULO
                                  </label>
                                  <Input
                                    className="form-control-alternative text-center text-dark"
                                    value={modulo.toLocaleUpperCase()}
                                    id="estadoMatricula"
                                    placeholder="Estado Matricula"
                                    type="text"
                                    disabled
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <hr />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-white shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">MI PERFIL</h3>
                  </Col>
                  <Col xs="4">
                    <Button
                      className="float-right"
                      color="primary"
                      onClick={handleHabilitarCampos}
                      size="sm"
                      title="Actualizar Informacion del perfil"
                    >
                      <i class="fa-regular fa-pen-to-square"></i>
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleActualizarPerfil}>
                  <h6 className="heading-small text-muted mb-4">
                    Informacion Usuario
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
                            value={usuarioNew.nombre}
                            id="nombre"
                            name="nombre"
                            placeholder="Nombres y Apellidos"
                            type="text"
                            disabled={disabledInputs}
                            onChange={handleChange}
                            required
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
                            value={usuarioNew.telefono}
                            id="telefono"
                            name="telefono"
                            placeholder="telefono"
                            type="text"
                            disabled={disabledInputs}
                            onChange={handleChange}
                            required
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
                            name="email"
                            value={usuarioNew.email}
                            type="email"
                            placeholder="Correo Electronico"
                            disabled
                            onChange={handleChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Cedula
                          </label>
                          <Input
                            className="form-control-alternative text-center text-dark"
                            value={usuarioNew.cedula}
                            name="cedula"
                            id="cedula"
                            placeholder="Documento"
                            type="text"
                            disabled
                            onChange={handleChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Fecha Nacimiento
                          </label>

                          <Input
                            className="form-control-alternative text-center text-dark"
                            value={usuarioNew?.fechaNacimiento?.slice(0, 10)}
                            id="celular"
                            name="fechaNacimiento"
                            placeholder="Celular"
                            type="date"
                            disabled={disabledInputs}
                            onChange={handleChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  {!disabledInputs &&(
                 <div className="text-center">
                 <Button color="primary" type="submit">
                   Actulizar Perfil
                 </Button>
                 </div>
               )}
                  {/* <hr className="my-4" /> */}
                </Form>
               
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal isOpen={modal} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>Foto de Perfil</ModalHeader>
        <ModalBody>
          <img
            alt="Imagen de perfil"
            src={urlImagen}
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
    </>
  );
};

export default Perfil;
