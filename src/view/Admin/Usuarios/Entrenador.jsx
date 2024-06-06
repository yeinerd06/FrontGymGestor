// reactstrap components
import React from "react";
import {
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  CardBody,
  Button,
  FormGroup,
  Label,
  Input,
  Modal,
  CardFooter,
  Form,
} from "reactstrap";
// core components
import Header from "../../../components/Headers/Header";
import DataTable from "react-data-table-component";
import { listaUsuarioRol, updateUsuario } from "../../../api/Usuarios/Usuario";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  customTheme,
  customStyles,
} from "../../../components/Datatable/DatatableCustom";
import { saveEntrenador } from "../../../api/Registro/Entrenador";
import "../../../assets/css/spinner.css";
import Swal from "sweetalert2";
import { sendEmailNuevoUsuario } from "../../../api/Membresia/Membresia";
import SpinnerGrupo from "../../../components/Sppiner";
import { MagicMotion } from "react-magic-motion";
import { useUserContext } from "../../../components/Context/UserContext";


const Entrenador = () => {
  const [loading,setLoading]=useState(false)
  const {entrenadores, setEntrenadores} = useUserContext();
  const [filtro, setFiltro] = useState("");
  //Activar spinner
  const [downloading, setDownloading] = useState(false);
  
  const [entrenador,setEntrenador]=useState([]);
  //Modal registrar entrenador
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setEntrenador([])
    setModal(!modal);
  };
  //Modal editar entrenador
  const [modalUpdate, setModalUpdate] = useState(false);
  const toggleUpdate = () => {
    setModalUpdate(!modalUpdate);
  };
//Listado de entrenadores
  const listado = async () => {
    try {
      const response = await listaUsuarioRol(3);
      const data = await response.json();
      setLoading(false)
      setEntrenadores(data);
    } catch (error) {
      console.log(error);
    }
  };
 
  
  //Abrir modal y cargar entrenador
  const handleOpciones = (entrenador) => {
    toggleUpdate();
    setEntrenador(entrenador.usuario);
  };

  //Actualizar campos del modal
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEntrenador((prevEntrenador) => ({ ...prevEntrenador, [name]: value }));
  };

  // useEffect(() => {
  //   listado();
  // }, []);
//Registrar entrenador
  const registrarEntrenador = (e) => {
    e.preventDefault();
    setDownloading(true);
    saveEntrenador(entrenador)
      .then((response) => response.json())
      .then((data) => {
        sendEmail(data.id)
        setDownloading(false);
        setEntrenador([]);
        listado();
        toggle();
        Swal.fire({
          icon: "success",
          title: "¡Completado!",
          text: "Entrenador  registrado.",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => {
        setDownloading(false);
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Ha ocurrido un error.",
          text: "Por favor, intentelo mas tarde.",
          confirmButtonText: "Aceptar",
        });
      });
  };

  //Actualizar Entrenador
  const actualizarEntrenador= (e)=>{
    e.preventDefault();
    setDownloading(true)
    updateUsuario(entrenador)
      .then(response=>{
        if(response.ok){
          
          toggleUpdate()
          listado()
          setDownloading(false)
          Swal.fire({
            icon: "success",
            title: "¡Completado!",
            text: "Informacion  actualizada.",
            showConfirmButton: false,
            timer: 1500,
          });

        }else{
          setDownloading(false)
          Swal.fire({
            icon: "error",
            title: "Ha ocurrido un error.",
            text: "Por favor, intentelo mas tarde.",
            confirmButtonText: "Aceptar",
          });
        }
      })
      .catch(error=>{
        console.log(error)
        setDownloading(false)
      })
  }
  //Enviar email usuario nuevo
  const sendEmail= async(id)=>{
    sendEmailNuevoUsuario(id)
    .then(response=>response.json())
    .then(data=>{
    })
    .catch(err=>{
      console.log(err)
    })
  }
  const columns = [
    {
      name: "Id",
      selector: (row) => row.usuario.id,
      sortable: true,
      maxWidth: "35px",
    },
    {
      name: "Nombre",
      selector: (row) => row.usuario.nombre,
      sortable: true,
      wrap: true,
    },
    {
      name: "Cedula",
      cell: (row) => row.usuario.cedula,
      selector: (row) => row.usuario.cedula,
      sortable: true,
      wrap: true,
    },
    {
      name: "Telefono",
      cell: (row) => row.usuario.telefono,
      selector: (row) => row.usuario.telefono,
      sortable: true,
      wrap: true,
    },
    {
      name: "Email",
      cell: (row) => row.usuario.email,
      selector: (row) => row.usuario.email,
      sortable: true,
      wrap: true,
    },
    {
      name: "Fecha nacimiento",
      cell: (row) => row.usuario.fechaNacimiento.split("T")[0],
      selector: (row) => row.usuario.fechaNacimiento.split("T")[0],
      sortable: true,
      wrap: true,
    },

    {
      name: "Acciones",
      cell: (row) => (
        <div className=" d-flex justify-content-end">
          <h3 onClick={() => handleOpciones(row)}>
            <Link className="text-primary fw-bold h2" title="Actualizar">
              {" "}
              <i className="fa-regular fa-pen-to-square" />
            </Link>
          </h3>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  //filtrar entrenadores por cedula
  const filtroProblemas = entrenadores.filter((entrenador) =>
    entrenador.usuario.cedula.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Contenido */}
        {downloading && (
          <div className="overlay">
            <div className="spinner " aria-hidden="true"></div>
          </div>
        )}
        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">LISTA DE ENTRENADORES</h3>
                  </div>
                  <div className="col text-right">
                    <Link
                    title="Registrar">
                    <Button color="primary" type="submit" onClick={toggle}>
                      <i className="fa fa-plus" /> 
                    </Button>
                    </Link>
                  </div>
                </Row>
                <FormGroup row className="justify-content-center mr-2 mt-3">
                  <Label for="filtro" sm={3} className="text-center">
                    Buscar :
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="text"
                      className=""
                      placeholder="Buscar por Cedula..."
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                    />
                  </Col>
                </FormGroup>
              </CardHeader>
              <CardBody>
                {loading ?(
                  <SpinnerGrupo/>
                ):(
                  <>
                  <DataTable
                    theme={customTheme}
                    customStyles={customStyles}
                    columns={columns}
                    data={filtroProblemas}
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
                </>
                )}
              
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Modal registrar entrenador */}
      <Modal
        className="modal-dialog-centered"
        size="lg"
        isOpen={modal}
        toggle={toggle}
      >
        <div className="modal-body p-0">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-0 d-flex justify-content-between">
              <div
                className="text-muted text-center mt-2 mb-3"
                style={{ flex: 1, textAlign: "center" }}
              >
                <h2 className="text-uppercase">Registrar Entrenador</h2>
              </div>
              <button
                className="btn btn-close text-dark"
                style={{
                  backgroundColor: "transparent", // Color de fondo del botón transparente
                  border: "none",
                }}
                onClick={toggle}
              >
                <i class="fa fa-times-circle" aria-hidden="true"></i>
              </button>
            </CardHeader>
            <Form onSubmit={registrarEntrenador}>
              <CardBody className="px-lg-3 py-lg-2">
                {entrenador && (
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="nombre">
                          Nombre's
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="nombre"
                          name="nombre"
                          placeholder="Marlon"
                          value={entrenador.nombre}
                          onChange={handleChange}
                          type="text"
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="email">
                          Correo Electronico
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="email"
                          name="email"
                          placeholder="jesse@example.com"
                          type="email"
                          value={entrenador.email}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="cedula">
                          Cedula
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="cedula"
                          name="cedula"
                          placeholder="302541787"
                          type="text"
                          value={entrenador.cedula}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="telefono"
                        >
                          Telefono
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="telefono"
                          name="telefono"
                          placeholder="302541787"
                          type="text"
                          value={entrenador.telefono}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="fechaNacimiento"
                        >
                          Fecha de Nacimiento
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="fechaNacimiento"
                          name="fechaNacimiento"
                          type="date"
                          value={entrenador?.fechaNacimiento?.split("T")[0]}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                )}
              </CardBody>
              <CardFooter className="d-flex justify-content-between">
                <Button className="btn-white" color="default" onClick={toggle}>
                  Cerrar
                </Button>
                <Button className="text-white" color="default" type="submit">
                  Guardar
                </Button>
              </CardFooter>
            </Form>
          </Card>
        </div>
      </Modal>
      {/* Modal actulizar entrenador */}
      <Modal
        className="modal-dialog-centered"
        size="lg"
        isOpen={modalUpdate}
        toggle={toggleUpdate}
      >
        <div className="modal-body p-0">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-0 d-flex justify-content-between">
              <div
                className="text-muted text-center mt-2 mb-3"
                style={{ flex: 1, textAlign: "center" }}
              >
                <h2 className="text-uppercase">Actualizar Entrenador</h2>
              </div>
              <button
                className="btn btn-close text-dark"
                style={{
                  backgroundColor: "transparent", // Color de fondo del botón transparente
                  border: "none",
                }}
                onClick={toggleUpdate}
              >
                <i class="fa fa-times-circle" aria-hidden="true"></i>
              </button>
            </CardHeader>
            <Form onSubmit={actualizarEntrenador}>
              <CardBody className="px-lg-3 py-lg-2">
                {entrenador && (
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="nombre">
                          Nombre's
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="nombre"
                          name="nombre"
                          placeholder="Marlon"
                          value={entrenador.nombre}
                          onChange={handleChange}
                          type="text"
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="email">
                          Correo Electronico
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="email"
                          name="email"
                          placeholder="jesse@example.com"
                          type="email"
                          value={entrenador.email}
                          onChange={handleChange}
                          disabled
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="cedula">
                          Cedula
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="cedula"
                          name="cedula"
                          placeholder="302541787"
                          type="text"
                          value={entrenador.cedula}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="telefono"
                        >
                          Telefono
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="telefono"
                          name="telefono"
                          placeholder="302541787"
                          type="text"
                          value={entrenador.telefono}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="fechaNacimiento"
                        >
                          Fecha de Nacimiento
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="fechaNacimiento"
                          name="fechaNacimiento"
                          type="date"
                          value={entrenador?.fechaNacimiento?.split("T")[0]}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                )}
              </CardBody>
              <CardFooter className="d-flex justify-content-between">
                <Button className="btn-white" color="default" onClick={toggleUpdate}>
                  Cerrar
                </Button>
                <Button className="text-white" color="default" type="submit">
                  Guardar
                </Button>
              </CardFooter>
            </Form>
          </Card>
        </div>
      </Modal>
    </>
  );
};

export default Entrenador;
