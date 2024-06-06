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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
// core components
import classnames from "classnames";
import Header from "../../../components/Headers/Header";
import DataTable from "react-data-table-component";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  customTheme,
  customStyles,
} from "../../../components/Datatable/DatatableCustom";
import "../../../assets/css/spinner.css";
import Swal from "sweetalert2";
import {
  listaMembresia,
  saveMembresia,
  updateMembresia,
  listaUsuarioMembresia,
  listaUsuarioMembresiaInforme,
  deleteMembresia,
  listaMembresiaActivas,
} from "../../../api/Membresia/Membresia";
import SpinnerGrupo from "../../../components/Sppiner";
import { MagicMotion } from "react-magic-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useUserContext } from "../../../components/Context/UserContext";
import { downloadPdfComprobante } from "../../../api/Membresia/Comprobante";

const Membresia = () => {
  //Spinner
  const [loading, setLoading] = useState(false);
  //Spinner
  const [loading2, setLoading2] = useState(false);
  //Filtro membresia
  const [filtro, setFiltro] = useState("");
  //Filtro Usuariosmembresia
  const [filtroUsuarios, setFiltroUsuarios] = useState("");
  //Activar spinner
  const [downloading, setDownloading] = useState(false);
  //lista de membresia
  const {
    membresias,
    setMembresias,
    usuariosMembresias,
    setUsuariosMembresias,
    setMembresiasActivas
  } = useUserContext();
  //Membresia selecionada
  const [membresia, setMembresia] = useState([]);

  //Modal registrar entrenador
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setMembresia([]);
    setModal(!modal);
  };

  //Modal editar entrenador
  const [modalUpdate, setModalUpdate] = useState(false);
  const toggleUpdate = () => {
    setModalUpdate(!modalUpdate);
  };
  //Modal Informe
  const [modalInforme, setModalInforme] = useState(false);
  const toggleInforme = () => {
    setModalInforme(!modalInforme);
  };
  //Listado de membresias
  const listado = async () => {
    try {
      setLoading(true);
      const response = await listaMembresia();
      const data = await response.json();
      setLoading(false);
      setMembresias(data);
      console.log(data)
    } catch (error) {
      console.log(error);
    }
  };
  //Listado de membresias activas
  const listadoMembresiasActvias = async () => {
    try {
      const response = await listaMembresiaActivas();
      const data = await response.json();

      setMembresiasActivas(data);
    } catch (error) {
      console.log(error);
    }
  };


  //Abrir modal y cargar Membresia
  const handleOpciones = (membresia) => {
    toggleUpdate();
    setMembresia(membresia);
  };

  const eliminarMembresia = (id) => {
    console.log(id);
    Swal.fire({
      title: "Eliminar Membresia?",
      text: "esta accion es permanente!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMembresia(id)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            Swal.fire({
              title: "Eliminado!",
              text: "La membresia se elimino.",
              icon: "success",
            });
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  };
  useEffect(() => {
    console.log("Valor de membresia.estado:", membresia.estado);
  }, [membresia.estado]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    // Manejar el estado del checkbox
    const newValue = type === 'checkbox' ? checked : value;
  
    setMembresia((prevEntrenador) => ({ ...prevEntrenador, [name]: newValue }));
  };
  

  //Registrar Membresia
  const registrarMembresia = (e) => {
    e.preventDefault();
    setDownloading(true);
    saveMembresia(membresia)
      .then((response) => response.json())
      .then((data) => {
        setDownloading(false);
        setMembresia([]);
        listado();
        listadoMembresiasActvias()
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

  //Actualizar Membresia
  const actualizarMembresia = (e) => {
    e.preventDefault();
   setDownloading(true);
    updateMembresia(membresia)
      .then((response) => {
        if (response.ok) {
          toggleUpdate();
          listado();
          listadoMembresiasActvias()
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

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
      wrap: true,
    },
    {
      name: "Precio",
      cell: (row) =>
        row.precio.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
        }),
      selector: (row) => row.precio,
      sortable: true,
      wrap: true,
    },
    {
      name: "Duracion",
      cell: (row) => row.duracion + " Dias",
      selector: (row) => row.duracion,
      sortable: true,
      wrap: true,
     
    },
    {
      name: "Descripcion",
      cell: (row) => row.descripcion,
      selector: (row) => row.descripcion,
      sortable: true,
      wrap: true,
      width:"30%"
    },
    {
      name: "Estado",
      cell: (row) => row.estado ?
       <Link className="text-primary h2" title="ACTIVA">
        <i class="fa fa-check-square text-success fw-bold" aria-hidden="true"/>
       </Link>
      :<Link className="text-primary h2" title="OCULTA">
        <i class="fa fa-ban text-red" aria-hidden="true"/>
      </Link> 
      ,
      selector: (row) => row.estado,

      sortable: true,
      maxWidth: "35px",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className=" d-flex justify-content-end">
          <h3 onClick={() => handleOpciones(row)}>
            <Link className="text-primary h2" title="Actualizar">
              {" "}
              <i className="fa-regular fa-pen-to-square fw-bold " />
            </Link>
          </h3>
          {/* <span style={{ marginRight: '10px' }}></span> 
          <h3 onClick={() => eliminarMembresia(row.id)}>
            <Link className="text-red  h2" title="Actualizar">
              {" "}
              <i className="fa fa-trash fw-bold " />
            </Link>
          </h3> */}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  const columnsUsuarios = [
    {
      name: "Membresia ",
      selector: (row) => buscarMembresia(row.membresiaId),
      sortable: true,
    },

    {
      name: "Precio",
      cell: (row) =>
        row.precio.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
        }),
      selector: (row) => row.precio,
      sortable: true,
      wrap: true,
    },
    // {
    //   name: "Cliente",
    //   cell: (row) => row.usuarioId.nombre,
    //   selector: (row) => row.usuarioId.nombre,
    //   sortable: true,
    //   wrap: true,
    // },
    {
      name: "Cedula Cliente",
      cell: (row) => row.usuarioId.cedula,
      selector: (row) => row.usuarioId.cedula,
      sortable: true,
      wrap: true,
    },
    {
      name: "Vendedor",
      cell: (row) => row.vendedorId.nombre,
      selector: (row) => row.vendedorId.nombre,
      sortable: true,
      wrap: true,
    },

    {
      name: "Estado",
      cell: (row) => (
        <div className=" d-flex justify-content-end">
          <h3>
            <Link className="" title="Informacion">
              {calcularDiferencia(row.fechaFin.split("T")[0]) >= 0 ? (
                <i className="fa fa-check-circle text-success fw-bold" />
              ) : (
                <i className="fa fa-times-circle text-danger" />
              )}
            </Link>
          </h3>
        </div>
      ),
      selector: (row) => calcularDiferencia(row.fechaFin),
      sortable: true,
      wrap: true,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "PDF",

      selector: (row) => row.id,
      cell: (row) => (
        <>
          <Link
            onClick={() => descargarComprobante(row.id)}
            className="h3 hover"
            title="descargar"
          >
            <i class="fa fa-download text-primary fa-1x" aria-hidden="true"></i>
          </Link>
        </>
      ),
      sortable: true,
      wrap: true,
    },
    // {
    //   name: "Dias",
    //   cell: (row) => (
    //     <>{calcularDiferenciaEnDias(row.fechaInicio, row.fechaFin)}</>
    //   ),
    //   selector: (row) => {
    //     calcularDiferenciaEnDias(row.fechaInicio, row.fechaFin);
    //   },
    //   sortable: true,
    //   wrap: true,
    // },
    {
      name: "Fecha Registro",
      selector: (row) => row.fechaRegistro.split("T")[0],
      sortable: true,
      wrap: true,
    },
  ];

  const calcularDiferencia = (fecha2) => {
    // Parsea las fechas en objetos Date
    const fechaInicio = new Date();
    const fechaFin = new Date(fecha2);

    // Calcula la diferencia en milisegundos
    const diferenciaEnMilisegundos = fechaFin - fechaInicio;

    // Convierte la diferencia en días
    const diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);

    return Math.floor(diferenciaEnDias); // Redondea hacia abajo para obtener el número entero de días
  };
  const calcularDiferenciaEnDias = (fecha1, fecha2) => {
    // Parsea las fechas en objetos Date
    const fechaInicio = new Date(fecha1);
    const fechaFin = new Date(fecha2);

    // Calcula la diferencia en milisegundos
    const diferenciaEnMilisegundos = fechaFin - fechaInicio;

    // Convierte la diferencia en días
    const diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);

    return Math.abs(Math.round(diferenciaEnDias)); // Usamos Math.abs para asegurarnos de que la diferencia sea positiva
  };
  //filtrar Membresia por nombre
  const filtroProblemas = membresias?.filter((membresia) =>
    membresia?.nombre?.toLowerCase().includes(filtro?.toLowerCase())
  );
  //filtrar Membresia por nombre
  const filtroUsuariosMembresias = usuariosMembresias?.filter((membresia) =>
    membresia?.usuarioId?.cedula
      .toLowerCase()
      .includes(filtroUsuarios?.toLowerCase())
  );

  const buscarMembresia = (id) => {
    // Utiliza el método find para buscar la membresía por ID
    const membresiaEncontrada = membresias.find(
      (membresia) => membresia.id === id
    );

    // Verifica si se encontró la membresía
    if (membresiaEncontrada) {
      return membresiaEncontrada.nombre;
    } else {
      // Retorna null si no se encuentra la membresía
      return null;
    }
  };

  const toggleNavs = (index) => {
    setTabs(index);
  };
  const [tabs, setTabs] = useState(1);

  const generarInforme = (e) => {
    e.preventDefault();

    setDownloading(true);
    const formData = new FormData(e.target);
    const fechaInicio = formData.get("fechaInicio");
    const fechaFin = formData.get("fechaFin");
    if (fechaInicio >= fechaFin) {
      alert("La fecha de inicio debe ser menor que la fecha de fin");
      setDownloading(false);
      return;
    }

    listaUsuarioMembresiaInforme(fechaInicio, fechaFin)
      .then((res) => res.blob())
      .then((blob) => {
        setDownloading(false);
        if (blob.size === 0) {
          alert("No hay membresias vendidas en ese rango de fechas");
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "reporte.pdf";
          document.body.appendChild(a);
          a.click();
        }
      })
      .catch((e) => {
        setDownloading(false);
        console.log(e);
      });
  };
  const descargarComprobante = (id) => {
    setDownloading(true);
    downloadPdfComprobante(id)
      .then((res) => res.blob())
      .then((blob) => {
        setDownloading(false);
        if (blob.size === 0) {
          alert("No hay membresias vendidas en ese rango de fechas");
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "comprobantePago.pdf";
          document.body.appendChild(a);
          a.click();
        }
      })
      .catch((e) => {
        setDownloading(false);
        console.log(e);
      });
  };

  const crearPDF = async (data, fechaInicio, fechaFin) => {
    // Crear una tabla HTML con los datos
    const table = document.createElement("table");
    table.classList.add("table");
    table.classList.add("text-center");
    table.classList.add("table-striped");
    table.classList.add("text-dark");
    table.classList.add("fw-bold");
    table.classList.add("table-responsive");
    const thead = document.createElement("thead");

    const tbody = document.createElement("tbody");

    // Crear encabezados de columna
    const headerRow = document.createElement("tr");

    const columnNames = [
      "Id",
      "Precio Membresia",
      "Fecha Registro",
      "Recepcionista ",
      "Cedula ",
      "Cliente",
      "Cedula",
    ];

    columnNames.forEach((columnName) => {
      const th = document.createElement("th");
      th.textContent = columnName;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    let total = 0;
    // Crear filas de datos
    data.forEach((row) => {
      const tr = document.createElement("tr");
      const dateOptions = { year: "numeric", month: "numeric", day: "numeric" };
      total += row.precio;
      const fechaRegistro = new Date(row.fechaRegistro).toLocaleDateString(
        undefined,
        dateOptions
      );

      const tdId = document.createElement("td");
      tdId.textContent = row.id;
      tr.appendChild(tdId);

      const tdPrecio = document.createElement("td");
      tdPrecio.textContent = row.precio.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      });
      tr.appendChild(tdPrecio);

      const tdFechaRegistro = document.createElement("td");
      tdFechaRegistro.textContent = fechaRegistro;
      tr.appendChild(tdFechaRegistro);

      const tdVendedorNombre = document.createElement("td");
      tdVendedorNombre.textContent = row.vendedorId.nombre;
      tr.appendChild(tdVendedorNombre);
      const tdVendedorCedula = document.createElement("td");
      tdVendedorCedula.textContent = row.vendedorId.cedula;
      tr.appendChild(tdVendedorCedula);

      const tdUsuarioNombre = document.createElement("td");
      tdUsuarioNombre.textContent = row.usuarioId.nombre;
      tr.appendChild(tdUsuarioNombre);
      tbody.appendChild(tr);
      const tdUsuarioCedula = document.createElement("td");
      tdUsuarioCedula.textContent = row.usuarioId.cedula;
      tr.appendChild(tdUsuarioCedula);
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    // Adjuntar la tabla al cuerpo del documento
    document.body.appendChild(table);

    // Convertir la tabla a PDF
    html2canvas(table)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.text(
          "Informe de membresías vendidas\nDesde: " +
            fechaInicio +
            " Hasta: " +
            fechaFin +
            "\nTotal recaudado: " +
            total.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            }),
          20,
          20
        ); // Agregar texto al PDF

        pdf.addImage(imgData, "PNG", 0, 40, 0, 0);
        pdf.save("informe_" + fechaInicio + "_" + fechaFin + ".pdf");

        // Eliminar la tabla del cuerpo del documento después de generar el PDF
        document.body.removeChild(table);
        toggleInforme();
        setDownloading(false);
      })
      .catch((error) => {
        console.log(error);
        toggleInforme();
        setDownloading(false);
      });
  };

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
              <CardBody>
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
                        Membresias
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
                        Membresias Vendidas
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
                        <Row className="align-items-center">
                          <div className="col">
                            <h3 className="mb-0">LISTA DE MEMBRESIAS</h3>
                          </div>
                          <div className="col text-right">
                            <Link title="Registrar">
                              <Button
                                color="primary"
                                type="submit"
                                onClick={toggle}
                              >
                                <i className="fa fa-plus" />
                              </Button>
                            </Link>
                          </div>
                        </Row>
                        <FormGroup
                          row
                          className="justify-content-center mr-2 mt-3"
                        >
                          <Label for="filtro" sm={3} className="text-center">
                            Buscar por Nombre:
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="text"
                              className=""
                              placeholder="BASIC FITNESS"
                              value={filtro}
                              onChange={(e) => setFiltro(e.target.value)}
                            />
                          </Col>
                        </FormGroup>
                        {loading ? (
                          <SpinnerGrupo />
                        ) : (
                          <>
                            <DataTable
                              theme={customTheme}
                              customStyles={customStyles}
                              columns={columns}
                              data={filtroProblemas}
                              striped
                              pointerOnHover
                              responsive
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
                      </TabPane>
                      <TabPane tabId="tabs2">
                        <Row className="align-items-center">
                          <div className="col">
                            <h3 className="mb-0">
                              LISTA DE MEMBRESIAS VENDIDAS
                            </h3>
                          </div>
                          <div className="col text-right">
                            <Link title="Registrar">
                              <Button
                                color="primary"
                                type="submit"
                                onClick={toggleInforme}
                              >
                                <i className="fa fa-download fa-1x" /> INFORME
                              </Button>
                            </Link>
                          </div>
                        </Row>
                        <FormGroup
                          row
                          className="justify-content-center mr-2 mt-3"
                        >
                          <Label for="filtro" sm={3} className="text-center">
                            Buscar por cedula:
                          </Label>
                          <Col sm={4}>
                            <Input
                              type="number"
                              className=""
                              placeholder="1090 874 5254"
                              value={filtroUsuarios}
                              onChange={(e) =>
                                setFiltroUsuarios(e.target.value)
                              }
                            />
                          </Col>
                        </FormGroup>
                        {loading2 ? (
                          <SpinnerGrupo />
                        ) : (
                          <>
                            <DataTable
                              theme={customTheme}
                              customStyles={customStyles}
                              columns={columnsUsuarios}
                              data={filtroUsuariosMembresias}
                              striped
                              pointerOnHover
                              responsive
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
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Modal registrar Membresia */}
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
                <h2 className="text-uppercase">Registrar Membresia</h2>
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
            <Form onSubmit={registrarMembresia}>
              <CardBody className="px-lg-3 py-lg-2">
                {membresia && (
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="nombre">
                          Nombre
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="nombre"
                          name="nombre"
                          placeholder="Basic Fitness"
                          value={membresia.nombre}
                          onChange={handleChange}
                          type="text"
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="email">
                          Descripcion
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="descripcion"
                          name="descripcion"
                          placeholder=" Acceso completo a nuestras instalaciones de gimnasio, incluyendo equipo de entrenamiento cardiovascular y de fuerza. Ideal para personas que desean mantenerse en forma"
                          type="textarea"
                          value={membresia.descripcion}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="cedula">
                          Precio (Pesos)
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="precio"
                          name="precio"
                          placeholder="$ 70000.00"
                          type="number"
                          value={membresia.precio}
                          onChange={handleChange}
                          min={1}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="telefono"
                        >
                          Duracion (Dias)
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="duracion"
                          name="duracion"
                          placeholder="30"
                          type="number"
                          value={membresia.duracion}
                          onChange={handleChange}
                          min={1}
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
      {/* Modal actulizar Membresia */}
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
                <h2 className="text-uppercase">Actualizar Membresia</h2>
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
            <Form onSubmit={actualizarMembresia}>
              <CardBody className="px-lg-3 py-lg-2">
                {membresia && (
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="nombre">
                          Nombre
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="nombre"
                          name="nombre"
                          placeholder="Basic Fitness"
                          value={membresia.nombre}
                          //onChange={handleChange}
                          disabled
                          type="text"
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="email">
                          Descripcion
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="descripcion"
                          name="descripcion"
                          placeholder=" Acceso completo a nuestras instalaciones de gimnasio, incluyendo equipo de entrenamiento cardiovascular y de fuerza. Ideal para personas que desean mantenerse en forma."
                          type="textarea"
                          value={membresia.descripcion}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="5">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="cedula">
                          Precio (Pesos)
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="precio"
                          name="precio"
                          placeholder="$ 70000.00"
                          type="number"
                          value={membresia.precio}
                          onChange={handleChange}
                          min={1}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="5">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="telefono"
                        >
                          Duracion (Dias)
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="duracion"
                          name="duracion"
                          placeholder="30"
                          type="number"
                          value={membresia.duracion}
                          onChange={handleChange}
                          required
                          min={1}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="2">
                      <FormGroup>
                      <label
                            className="form-control-label"
                            htmlFor="telefono"
                          >
                            Estado
                          </label>
                        <FormGroup check className="mt-2 fw-bold h3">
                          
                          <Input id="estado" name="estado" type="checkbox"
                          value={membresia?.estado+""}
                          checked={membresia?.estado}
                          onChange={handleChange} />{" "}
                          <Label check>Activa</Label>
                        </FormGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                )}
              </CardBody>
              <CardFooter className="d-flex justify-content-between">
                <Button
                  className="btn-white"
                  color="default"
                  onClick={toggleUpdate}
                >
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
      {/* Modal Informe Membresia */}
      <Modal
        className="modal-dialog-centered"
        size="lg"
        isOpen={modalInforme}
        toggle={toggleInforme}
      >
        <div className="modal-body p-0">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-0 d-flex justify-content-between">
              <div
                className="text-muted text-center mt-2 mb-3"
                style={{ flex: 1, textAlign: "center" }}
              >
                <h2 className="text-uppercase">
                  Generar Informe de Membresias
                </h2>
              </div>
              <button
                className="btn btn-close text-dark"
                style={{
                  backgroundColor: "transparent", // Color de fondo del botón transparente
                  border: "none",
                }}
                onClick={toggleInforme}
              >
                <i class="fa fa-times-circle" aria-hidden="true"></i>
              </button>
            </CardHeader>
            <Form onSubmit={generarInforme}>
              <CardBody className="px-lg-3 py-lg-2">
                <p className="text-dark">
                  Busca las membresias que se vendieron en el rango de las
                  fechas{" "}
                </p>

                <Row>
                  <Col lg="6">
                    <FormGroup>
                      <label
                        className="form-control-label  text-primary"
                        htmlFor="cedula"
                      >
                        Fecha Inicio
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="fechaInicio"
                        name="fechaInicio"
                        placeholder=""
                        type="date"
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <label
                        className="form-control-label text-primary"
                        htmlFor="telefono"
                      >
                        Fecha Fin
                      </label>
                      <Input
                        className="form-control-alternative text-dark fw-bold"
                        id="fechaFin"
                        name="fechaFin"
                        type="date"
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter className="d-flex justify-content-between">
                <Button
                  className="btn-white"
                  color="default"
                  onClick={toggleInforme}
                >
                  Cerrar
                </Button>
                <Button className="text-white" color="default" type="submit">
                  <i className="fa fa-download fa-1x" /> Generar Informe
                </Button>
              </CardFooter>
            </Form>
          </Card>
        </div>
      </Modal>
    </>
  );
};

export default Membresia;
