import {
  Form,
  CardHeader,
  CardTitle,
  Container,
  Row,
  Col,
  Button,
  Table,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Modal,
  ModalBody,
  CardFooter,
} from "reactstrap";
import Header from "../../../components/Headers/Header";
import DataTable from "react-data-table-component";
import { listaUsuarioRol, updateUsuario } from "../../../api/Usuarios/Usuario";
import classnames from "classnames";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../../assets/css/spinner.css";
import Swal from "sweetalert2";
import {
  customTheme,
  customStyles,
} from "../../../components/Datatable/DatatableCustom";
import {
  listaMembresia,
  usuarioMembresiaByCedula,
  saveUsuarioMembresia,
  sendEmailNuevoUsuario,
  listaUsuarioMembresia,
} from "../../../api/Membresia/Membresia";
import { saveCliente } from "../../../api/Registro/Cliente";
import SpinnerGrupo from "../../../components/Sppiner";
import { useUserContext } from "../../../components/Context/UserContext";
import { downloadPdfComprobante, sendEmailComprobante } from "../../../api/Membresia/Comprobante";

const Cliente = () => {
  const{membresiasActivas, clientes,setClientes,setUsuariosMembresias}=useUserContext();
  const modulo=localStorage.getItem("modulo")
  const [tabs, setTabs] = useState(1);
  //const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [cedula, setCedula] = useState("");
  const [usuarioMembresia, setUsuarioMembresia] = useState([]);
  const [existeUsuario, setExisteUsuario] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedMembresia, setSelectedMembresia] = useState(null);
  const [color, setColor] = useState("primary");
  const [ocultarBoton, setOcultarBoton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState([]);
  //MODAL CLIENTE
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };
  //Abrir modal y cargar cliente
  const handleOpciones = (cliente) => {
    toggle();
    setCliente(cliente.usuario);
  };
  //Actualizar campos del modal
  const handleChange = (e) => {
    const { name, value } = e.target;

    setCliente((prevCliente) => ({ ...prevCliente, [name]: value }));
  };
  //Actualizar cliente
  const actualizarCliente = (e) => {
    e.preventDefault();
    setDownloading(true);
    updateUsuario(cliente)
      .then((response) => {
        if (response.ok) {
          toggle();
          listado();
          setDownloading(false);
          Swal.fire({
            icon: "success",
            title: "¡Completado!",
            text: "Informacion  actualizada.",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          setDownloading(false);
          Swal.fire({
            icon: "error",
            title: "Ha ocurrido un error.",
            text: "Por favor, intentelo mas tarde.",
            confirmButtonText: "Aceptar",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setDownloading(false);
      });
  };

  const toggleNavs = (index) => {
    setTabs(index);
  };
  //LISTADO DE CLIENTES
  const listado = async () => {
    try {
      setLoading(true);
      const response = await listaUsuarioRol(2); // Asegúrate de que la función listaUsuarioRol esté definida
      const data = await response.json();
      setClientes(data);
      setLoading(false);
      
    } catch (error) {
      console.log(error);
    }
  };
  //Listado de usuariosMembresias
  const listadoUsuarios = async () => {
    try {
      const response = await listaUsuarioMembresia();
      const data = await response.json();
      console.log(data)
      setUsuariosMembresias(data.reverse());
    } catch (error) {
      console.log(error);
    }
  };



  //Columnas de la Datatable
  const columns = [
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
  
  //Filtrar clientes por cedula en la datatable
  const filtroClientes = clientes.filter((cliente) =>
    cliente.usuario.cedula.toLowerCase().includes(filtro.toLowerCase())
  );
  //Guardar membresia selecionada
  const handleMembresiaSelect = (membresiaId) => {
    setSelectedMembresia(membresiaId);
  };

  //BUSCAR CLIENTE REGISTRADO
  const handleBuscarClick = (e) => {
    e.preventDefault();

    buscarUsuario();
  };
  //Enviar email usuario nuevo
  const sendEmail = async (id) => {
    sendEmailNuevoUsuario(id)
      .then((response) => response.json())
      .then((data) => {})
      .catch((err) => {
        console.log(err);
      });
  };
  //Buscar usuario por cedula
  const buscarUsuario = async () => {
    setDownloading(true);
    setOcultarBoton(false);
    usuarioMembresiaByCedula(cedula)
      .then((response) => response.json())
      .then((data) => {
        setColor("success");
        setUsuarioMembresia(data);
        setExisteUsuario(true);
      })
      .catch((err) => {
        setColor("danger");
        console.log(err);

        setExisteUsuario(false); // Establece existeUsuario en false
        setUsuarioMembresia([]); // Limpia los campos de usuarioMembresia
      })
      .finally((final) => {
        setDownloading(false);
      });
  };

  //REGISTRAR MEMBRESIA PARA CLIENTES NUEVOS Y ANTIGUOS
  const handleRegistrarMembresia = async (e) => {
    try {
      e.preventDefault();
      //CLIENTES ANTIGUOS
      if (existeUsuario) {
        usuarioMembresiaSave(usuarioMembresia.usuario.id);
        
      } else {
        //CLIENTES NUEVOS
        const formData = new FormData(e.target);
        const nombre = formData.get("input-nombre-new").toUpperCase();
        const email = formData.get("input-email-new").toUpperCase();
        const telefono = formData.get("input-telefono-new");
        const cedula = formData.get("input-cedula-new");
        const fechaNacimiento = formData.get("input-fechaNacimiento-new");

        const user = {
          nombre,
          email,
          telefono,
          cedula,
          fechaNacimiento,
        };
        saveCliente(user)
          .then((res) => res.json())
          .then((data) => {
            usuarioMembresiaSave(data.id);
            listado();
            sendEmail(data.id);
           
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Ha ocurrido un error registrado el cliente.",
              text: "Por favor, intentelo mas tarde.",
              confirmButtonText: "Aceptar",
            });
          });
      }
      
    } catch (error) {}
  };
//Enviar email con comprobante de pago

  const enviarComprobante =(id)=>{
    sendEmailComprobante(id)
    .then(res=>res.json())
    .then(data=>{
      console.log(data)
    })
    .catch(error=>{
      console.log(error)
    })
  }
 
  //GUARDAR USUARIO MEMBRESIA
  const usuarioMembresiaSave = async (usuarioId) => {
    setDownloading(true);
    let vendedorId = JSON.parse(localStorage.getItem("data")).id;

    const userMembresia = {
      vendedorId:{
        id:vendedorId
      },
      usuarioId:{
        id:usuarioId
      }
      ,
      membresiaId: selectedMembresia,
    };
    saveUsuarioMembresia(userMembresia)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        enviarComprobante(data.id)
        listadoUsuarios()
        Swal.fire({
          icon: "success",
          title: "¡Completado!",
          text: "El membresia se activo con éxito.",
          showConfirmButton: false,
          timer: 1500,
        });
        buscarUsuario();
        setOcultarBoton(true);
        setDownloading(false);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Ha ocurrido un error.",
          text: "Por favor, intentelo mas tarde.",
          confirmButtonText: "Aceptar",
        });
        setDownloading(false);
      });
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardBody>
                {downloading && (
                  <div className="overlay">
                    <div className="spinner " aria-hidden="true"></div>
                  </div>
                )}
                <div className="nav-wrapper">
                  <Nav
                    className="nav-fill flex-column flex-md-row"
                    id="tabs-icons-text"
                    pills
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        aria-selected={tabs === 1}
                        className={classnames("mb-sm-3 mb-md-0", {
                          active: tabs === 1,
                        })}
                        onClick={() => toggleNavs(1)}
                        role="tab"
                      >
                        <i className="ni ni-cloud-upload-96 mr-2" />
                        Registrar Membresia
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        aria-selected={tabs === 2}
                        className={classnames("mb-sm-3 mb-md-0", {
                          active: tabs === 2,
                        })}
                        onClick={() => toggleNavs(2)}
                        role="tab"
                      >
                        <i className="ni ni-bell-55 mr-2" />
                        Actualizar Informacion
                      </NavLink>
                    </NavItem>
                    {/* <NavItem>
                      <NavLink
                        aria-selected={tabs === 3}
                        className={classnames("mb-sm-3 mb-md-0", {
                          active: tabs === 3,
                        })}
                        onClick={() => toggleNavs(3)}
                        href="#Otro"
                        role="tab"
                      >
                        <i className="ni ni-calendar-grid-58 mr-2" />
                        Messages
                      </NavLink>
                    </NavItem> */}
                  </Nav>
                </div>
                <Card className="shadow">
                  <CardBody>
                    <TabContent activeTab={"tabs" + tabs}>
                      <TabPane tabId="tabs1">
                        <Row>
                          <Col size="12">
                            <Form onSubmit={handleBuscarClick}>
                              <h6 className="heading-small text-dark mb-4">
                                Buscar Cliente por cedula
                              </h6>
                              <div className="pl-lg-4">
                                <Row>
                                  <Col lg="12">
                                    <FormGroup>
                                      {/* <label
                                        className="form-control-label"
                                        htmlFor="input-cedula"
                                      >
                                        Cedula
                                      </label> */}
                                      <>
                                        <div className="d-flex">
                                          <Input
                                            className="form-control-alternative text-dark fw-bold "
                                            id="input-cedula"
                                            placeholder="1090587558"
                                            type="text"
                                            value={cedula}
                                            onChange={(e) =>
                                              setCedula(e.target.value)
                                            }
                                          />
                                          <Button color={color} type="submit">
                                            <i className="fa fa-search" />
                                          </Button>
                                        </div>
                                      </>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </div>
                            </Form>
                            <hr className="my-4" />
                            <Form onSubmit={handleRegistrarMembresia}>
                              {usuarioMembresia && existeUsuario ? (
                                <>
                                  <h6 className="heading-small text-dark mb-4">
                                    Cliente Registrado
                                  </h6>

                                  <div className="pl-lg-4">
                                    <Row>
                                      <Col lg="12">
                                        <FormGroup>
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-nombre"
                                          >
                                            Nombre's
                                          </label>
                                          <Input
                                            className="form-control-alternative text-dark fw-bold"
                                            id="input-nombre"
                                            placeholder="Marlon"
                                            type="text"
                                            value={
                                              usuarioMembresia?.usuario?.nombre
                                            }
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
                                            className="form-control-alternative text-dark fw-bold"
                                            id="input-email"
                                            placeholder="jesse@example.com"
                                            type="email"
                                            value={
                                              usuarioMembresia?.usuario?.email
                                            }
                                            disabled
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg="4">
                                        <FormGroup>
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-telefono"
                                          >
                                            Cedula
                                          </label>
                                          <Input
                                            className="form-control-alternative text-dark fw-bold"
                                            id="input-cedula"
                                            placeholder="302541787"
                                            type="text"
                                            value={
                                              usuarioMembresia?.usuario?.cedula
                                            }
                                            disabled
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg="4">
                                        <FormGroup>
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-telefono"
                                          >
                                            Telefono
                                          </label>
                                          <Input
                                            className="form-control-alternative text-dark fw-bold"
                                            id="input-telefono"
                                            placeholder="302541787"
                                            type="text"
                                            value={
                                              usuarioMembresia?.usuario
                                                ?.telefono
                                            }
                                            disabled
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg="4">
                                        <FormGroup>
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-telefono"
                                          >
                                            Fecha de Nacimiento
                                          </label>
                                          <Input
                                            className="form-control-alternative text-dark fw-bold"
                                            id="input-fechaNacimiento"
                                            type="date"
                                            value={
                                              usuarioMembresia?.usuario?.fechaNacimiento.split(
                                                "T"
                                              )[0]
                                            }
                                            disabled
                                          />
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>

                                  <hr className="my-4" />
                                  <h6 className="heading-small text-dark mb-4">
                                    Membresias activas
                                  </h6>

                                  <Table
                                    responsive
                                    className="striped text-dark"
                                  >
                                    <thead>
                                      <tr>
                                        <th>Activa</th>
                                        <th>Fecha de Inicio</th>
                                        <th>Fecha de Fin</th>
                                        <th>Precio</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {usuarioMembresia.usuarioMembresias.map(
                                        (membresia) => (
                                          <tr key={membresia.id}>
                                            <td>
                                              <i className="fa fa-check-circle text-success" />
                                            </td>
                                            <td>
                                              {
                                                membresia.fechaInicio.split(
                                                  "T"
                                                )[0]
                                              }
                                            </td>
                                            <td>
                                              {membresia.fechaFin.split("T")[0]}
                                            </td>
                                            <td>${membresia.precio}</td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </Table>
                                  <hr className="my-4" />
                                </>
                              ) : null}
                              {!existeUsuario && (
                                <>
                                  <h6 className="heading-small text-dark mb-4">
                                    Registrar Cliente
                                  </h6>

                                  <div className="pl-lg-4">
                                    <Row>
                                      <Col lg="12">
                                        <FormGroup>
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-nombre-new"
                                          >
                                            Nombre's
                                          </label>
                                          <Input
                                            className="form-control-alternative text-dark fw-bold"
                                            id="input-nombre-new"
                                            name="input-nombre-new"
                                            placeholder="Marlon"
                                            type="text"
                                            required
                                          />
                                        </FormGroup>
                                      </Col>

                                      <Col lg="12">
                                        <FormGroup>
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-email-new"
                                          >
                                            Correo Electronico
                                          </label>
                                          <Input
                                            className="form-control-alternative  text-dark fw-bold"
                                            id="input-email-new"
                                            name="input-email-new"
                                            placeholder="jesse@example.com"
                                            type="email"
                                            required
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg="4">
                                        <FormGroup>
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-cedula-new"
                                          >
                                            Cedula
                                          </label>
                                          <Input
                                            className="form-control-alternative text-dark fw-bold"
                                            id="input-cedula-new"
                                            name="input-cedula-new"
                                            placeholder="302541787"
                                            type="text"
                                            value={cedula}
                                            onChange={(e) =>
                                              setCedula(e.target.value)
                                            }
                                            required
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg="4">
                                        <FormGroup>
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-telefono-new"
                                          >
                                            Telefono
                                          </label>
                                          <Input
                                            className="form-control-alternative text-dark fw-bold"
                                            id="input-telefono-new"
                                            name="input-telefono-new"
                                            placeholder="302541787"
                                            type="text"
                                            required
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg="4">
                                        <FormGroup>
                                          <label
                                            className="form-control-label"
                                            htmlFor="input-fechaNacimiento-new"
                                          >
                                            Fecha de Nacimiento
                                          </label>
                                          <Input
                                            className="form-control-alternative  text-dark fw-bold"
                                            id="input-fechaNacimiento-new"
                                            name="input-fechaNacimiento-new"
                                            type="date"
                                            required
                                          />
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                  <hr className="my-4" />
                                </>
                              )}

                              {/* Description */}
                              <h6 className="heading-small text-dark mb-4">
                                Membresias
                              </h6>
                              <div className="pl-lg-4 d-flex overflow-auto">
                                {membresiasActivas ? (
                                  <>
                                    {membresiasActivas.map((membresia) => (
                                      <Col lg="6" xl="5" key={membresia.id}>
                                        <Card
                                          className=""
                                          color="dark"
                                          outline
                                        >
                                          <CardBody>
                                            <Row>
                                              <Link className="text-dark ">
                                                <Col className="col-auto  ">
                                                  <div
                                                    className={`icon icon-shape ${
                                                      selectedMembresia ===
                                                      membresia.id
                                                        ? "bg-success bordesCard"
                                                        : "bg-danger"
                                                    } text-white rounded-circle shadow  `}
                                                  >
                                                    <i className="fa fa-credit-card-alt" />
                                                  </div>
                                                </Col>
                                              </Link>

                                              <div className="col">
                                                <CardTitle
                                                  tag="h5"
                                                  className="text-uppercase text-dark mb-0  text-dark fw-bold"
                                                >
                                                  PRECIO
                                                </CardTitle>
                                                <p className="h2 font-weight-bold mb-0 text-center">
                                                  {membresia.precio.toLocaleString(
                                                    "es-CO",
                                                    {
                                                      style: "currency",
                                                      currency: "COP",
                                                    }
                                                  )}
                                                </p>
                                                <p className="h2 font-weight-bold mb-0 text-center">
                                                 {membresia.duracion} Dias
                                                </p>
                                              </div>
                                            </Row>
                                            <br />
                                            <div className="custom-control custom-radio mb-3 mt-3">
                                              <input
                                                className="custom-control-input  text-dark fw-bold h1"
                                                id={membresia.id}
                                                name="custom-radio-2"
                                                type="radio"
                                                value={membresia.id}
                                                onChange={() =>
                                                  handleMembresiaSelect(
                                                    membresia.id
                                                  )
                                                }
                                                required
                                              />
                                              <label
                                                className="custom-control-label "
                                                htmlFor={membresia.id}
                                              >
                                                {membresia.nombre}
                                              </label>
                                            </div>
                                            
                                          </CardBody>
                                        </Card>
                                      </Col>
                                    ))}
                                  </>
                                ) : null}
                              </div>

                              <hr className="my-4" />
                              {!ocultarBoton ? (
                                <div className="text-center">
                                  <Button
                                    className="text-white text-center"
                                    color="default"
                                    type="submit"
                                  >
                                    REGISTRAR
                                  </Button>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-success text-center h1">
                                    Membresia Registrada
                                  </p>
                                </div>
                              )}
                            </Form>
                          </Col>
                        </Row>
                      </TabPane>
                      <TabPane tabId="tabs2">
                        <Row className="align-items-center">
                          <div className="col">
                            <h6 className="heading-small text-dark mb-4">
                              Lista de clientes
                            </h6>
                          </div>
                          <div className="col text-right">
                            <FormGroup row className="justify-content-end mr-2">
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
                                  placeholder="Ingrese la Cedula..."
                                  value={filtro}
                                  onChange={(e) => setFiltro(e.target.value)}
                                />
                              </Col>
                            </FormGroup>
                          </div>
                        </Row>
                        <hr className="my-4" />
                        {loading ? (
                          <>
                            <SpinnerGrupo />
                          </>
                        ) : (
                          <Row>
                            <>
                              <DataTable
                                theme={customTheme}
                                customStyles={customStyles}
                                columns={columns}
                                data={filtroClientes}
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
                          </Row>
                        )}
                      </TabPane>
                      {/* <TabPane tabId="tabs3">
                        <p className="description">
                          Raw denim you probably haven't heard of them jean
                          shorts Austin. Nescuinit tofu stumptown aliqua, retro
                          synth master cleanse. Mustache cliche tempor,
                          williamsburg carles vegan helvetica. Reprehenderit
                          butcher retro keffiyeh dreamcatcher synth.
                        </p>
                      </TabPane> */}
                    </TabContent>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal editar cliente */}
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
                <h2>Modificar Cliente</h2>
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
            <Form onSubmit={actualizarCliente}>
              <CardBody className="px-lg-3 py-lg-2">
                {cliente && (
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="nombre">
                          Nombre's
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="nombre"
                          name="nombre"
                          placeholder="Marlon"
                          value={cliente.nombre}
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
                          className="form-control-alternative"
                          id="email"
                          name="email"
                          placeholder="jesse@example.com"
                          type="email"
                          value={cliente.email}
                          onChange={handleChange}
                          disabled={modulo==="admin"? false:true}
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
                          className="form-control-alternative"
                          id="cedula"
                          name="cedula"
                          placeholder="302541787"
                          type="text"
                          value={cliente.cedula}
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
                          className="form-control-alternative"
                          id="telefono"
                          name="telefono"
                          placeholder="302541787"
                          type="text"
                          value={cliente.telefono}
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
                          className="form-control-alternative"
                          id="fechaNacimiento"
                          name="fechaNacimiento"
                          type="date"
                          value={cliente?.fechaNacimiento?.split("T")[0]}
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
                  Guardar Cambios
                </Button>
              </CardFooter>
            </Form>
          </Card>
        </div>
      </Modal>
    </>
  );
};

export default Cliente;
