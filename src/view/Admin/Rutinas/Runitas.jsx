// reactstrap components
import React from "react";
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
  CardText,
  CardImg,
  Collapse,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
// core components
import classnames from "classnames";
import Header from "../../../components/Headers/Header";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  customTheme,
  customStyles,
} from "../../../components/Datatable/DatatableCustom";

import "../../../assets/css/spinner.css";
import Swal from "sweetalert2";
import {
  listaEquipamiento,
  saveEquipamiento,
  updateEquipamiento,
} from "../../../api/Rutinas/Equipamiento";
import {
  listaEjercicios,
  saveEjercicio,
  updateEjercicio,
} from "../../../api/Rutinas/Ejercicios";
import {
  deleteRutina,
  listaRutinas,
  saveRutina,
  updateRutina,
} from "../../../api/Rutinas/Rutinas";
import SpinnerGrupo from "../../../components/Sppiner";
import { MagicTabSelect } from "react-magic-motion";
import { useUserContext } from "../../../components/Context/UserContext";
import { listaAsistencia } from "../../../api/Asistencias/Asistencia";
import { listaMusculo, saveMusculo } from "../../../api/Rutinas/Musculo";

const Rutinas = () => {
  //Menu
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(true);
  
  const [musculos, setMusculos] = useState([]);
  const [tabs, setTabs] = useState(1);
  const toggleNavs = (index) => {
    setTabs(index);
  };
  //Spinner
  const [downloading, setDownloading] = useState(false);
  //---EQUIPAMIENTOS -----------------------------------------------------------------------------------

  const [equipamientos, setEquipamientos] = useState([]);
  const [filtro, setFiltro] = useState("");

  //Lista de equipamiento
  const listadoEquipamiento = async () => {
    try {
      const response = await listaEquipamiento();
      const data = await response.json();
      setLoading3(false);
      setEquipamientos(data);
    } catch (error) {
      console.log(error);
    }
  };
  //Lista de musculos
  const listadoMusculos = async () => {
    try {
      const response = await listaMusculo();
      const data = await response.json();
  
      setMusculos(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    listaMusculo()
    listadoEquipamiento();
  }, []);

  //Columnas de la tabla
  const columns = [
    { name: "Id", selector: (row) => row.id, sortable: true, maxWidth: "35px" },
    {
      name: "Nombre",
      cell: (row) => row.nombre,
      selector: (row) => row.nombre,
      sortable: true,
      wrap: true,
    },
    {
      name: "Cantidad",
      cell: (row) => row.cantidad,
      selector: (row) => row.cantidad,
      sortable: true,
      wrap: true,
    },
    {
      name: "Disponibilidad",
      cell: (row) => row.disponibilidad,
      selector: (row) => row.disponibilidad,
      sortable: true,
      wrap: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className=" d-flex justify-content-end">
          <h3 onClick={() => actualizarEquipamiento(row)}>
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
  //Filtro de la tabla
  const filtroEquipamiento = equipamientos.filter((equipameinto) =>
    equipameinto.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  //Guardar Equipamiento
  const [isOpen, setIsOpen] = useState(false);

  const toggleSave = () => setIsOpen(!isOpen);

  const [equipamientoError, setEquipamientoError] = useState(false);

  const guardarEquipamiento = (e) => {
    e.preventDefault();
    setDownloading(true);
    const formData = new FormData(e.target);
    const nombre = formData.get("nombre").toUpperCase();
    const cantidad = formData.get("cantidad");
    const disponibilidad = formData.get("disponibilidad");

    const equipameintoNew = {
      nombre,
      cantidad,
      disponibilidad,
    };
    if (disponibilidad > cantidad) {
      setEquipamientoError(true);
      setDownloading(false);
    } else {
      saveEquipamiento(equipameintoNew)
        .then((response) => response.json())
        .then((data) => {
          toggleSave();
          listadoEquipamiento();
          setDownloading(false);
          Swal.fire({
            icon: "success",
            title: "¡Completado!",
            text: "Informacion  actualizada.",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => {
          setDownloading(false);
          Swal.fire({
            icon: "error",
            title: "Ha ocurrido un error.",
            text: "Por favor, intentelo mas tarde.",
            confirmButtonText: "Aceptar",
          });
          console.log(error);
        });
    }
  };
  /*
    `<label for="swal-cantidad" class="swal2-input-label">Cantidad actual: ${equipamiento.cantidad}</label>` +
          `<input id="swal-cantidad" class="swal2-input"  type="number" min="1" value="${equipamiento.cantidad}" step="1"> ` +
        
  */
  // ACTUALIZAR EQUIPAMIENTO
  const actualizarEquipamiento = async (equipamiento) => {
    const { value: formValues } = await Swal.fire({
      title: "Actualizar Equipamiento",
      html: `
        <div class="row text-center fw-bold">
          <div class="col-xl-12">
            <div class="swal2-input-label-container">
              <label for="swal-nombre" class="swal2-input-label">
                Nombre actual: ${equipamiento.nombre}
              </label>
              <input
                id="swal-nombre"
                class="swal2-input"
                placeholder="Ingresa el nombre nuevo"
                value="${equipamiento.nombre}"
              >
            </div>
          </div>
          <div class="col-xl-12">
            <div class="swal2-input-label-container">
              <label for="swal-cantidad" class="swal2-input-label">
                Cantidad actual: ${equipamiento.cantidad}
              </label>
              <input
                id="swal-cantidad"
                class="swal2-input"
                placeholder="Ingresa la nueva cantidad"
                step="1"
                type="number"
                value="${equipamiento.cantidad}"
              >
            </div>
          </div>
          <div class="col-xl-12">
            <div class="swal2-input-label-container">
              <label for="swal-disponibilidad" class="swal2-input-label">
                Disponibilidad actual: ${equipamiento.disponibilidad}
              </label>
              <input
                id="swal-disponibilidad"
                class="swal2-input"
                placeholder="Ingresa la nueva cantidad"
                step="1"
                type="number"
                value="${equipamiento.disponibilidad}"
              >
            </div>
          </div>
          
        </div>`,
      focusConfirm: false,
      preConfirm: () => {
        return {
          nombre: document.getElementById("swal-nombre").value,
          cantidad: parseInt(
            document.getElementById("swal-cantidad").value,
            10
          ),
          disponibilidad: parseInt(
            document.getElementById("swal-disponibilidad").value,
            10
          ),
        };
      },
      showCancelButton: true,
    });

    if (
      formValues &&
      (formValues.nombre ||
        formValues.disponibilidad !== undefined ||
        formValues.cantidad !== undefined)
    ) {
      setDownloading(true);

      const equipamientoNew = {
        id: equipamiento.id,
        nombre: formValues.nombre || equipamiento.nombre,
        cantidad:
          formValues.cantidad !== undefined
            ? parseInt(formValues.cantidad, 10)
            : equipamiento.cantidad,
        disponibilidad:
          formValues.disponibilidad !== undefined
            ? parseInt(formValues.disponibilidad, 10)
            : equipamiento.disponibilidad,
      };

      if (Number(equipamientoNew.disponibilidad) <= equipamientoNew.cantidad) {
        console.log(equipamientoNew);

        if (equipamientoNew.cantidad > 0) {
          updateEquipamiento(equipamientoNew).then((response) => {
            if (response.ok) {
              setDownloading(false);
              listadoEquipamiento();
              Swal.fire(`Equipamiento actualizado`);
            } else {
              setDownloading(false);
            }
          });
        } else {
          setDownloading(false);
          Swal.fire(`La cantidad debe ser mayor que 0`);
        }
      } else {
        setDownloading(false);
        Swal.fire(`La Disponibilidad debe ser menor o igual que la cantidad`);
      }
    }
  };

  //----------------------------------------------------------------------------------------------------
  // ----EJERCICIOS ------------------------------------------------------------------------------------
  //Lista de ejercicios
  const { ejercicios, setEjercicios, rutinas, setRutinas } = useUserContext();
  // const [ejercicios, setEjercicios] = useState([]);
  const [filtroEjercicio, setFiltroEjercicio] = useState("");
  // useEffect(() => {
  //   listadoEjercicios();
  // }, []);
  const listadoEjercicios = () => {
    setLoading2(true);
    listaEjercicios()
      .then((response) => response.json())
      .then((data) => {
        setLoading2(false);
        setEjercicios(data);
      })
      .catch((error) => {
        console.log(error);
        setLoading2(false);
      });
  };
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
  //Modal registrar ejercicios
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setEjercicio({
      nombre: "",
      descripcion: "",
      tipoEjercicio: "",
      musculaturaTrabajada: "",
      instrucciones: "",
      video: "",
      equipamientos: [], // Agregar un array para guardar
    });
    setModal(!modal);
  };
  //Actualizar campos del modal
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const equipamiento = {
      id: Number(value),
    };
    if (type === "checkbox") {
      // Si es un campo de tipo checkbox, gestionar las selecciones
      if (checked) {
        // Agregar el equipamiento seleccionado al array
        setEjercicio((prevEjercicio) => ({
          ...prevEjercicio,
          equipamientos: [...prevEjercicio.equipamientos, equipamiento],
        }));
      } else {
        // Eliminar el equipamiento deseleccionado del array
        setEjercicio((prevEjercicio) => ({
          ...prevEjercicio,
          equipamientos: prevEjercicio.equipamientos.filter(
            (item) => item.id !== equipamiento.id
          ),
        }));
      }
    } else {
      // Para otros campos, simplemente actualizar el valor
      setEjercicio((prevEjercicio) => ({ ...prevEjercicio, [name]: value }));
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
  //Registrar Ejercicio
  const registrarEjercicio = (e) => {
    e.preventDefault();
    setDownloading(true);

    saveEjercicio(ejercicio)
      .then((response) => response.json())
      .then((data) => {
        toggle();
        listadoEjercicios();
        setDownloading(false);
        Swal.fire({
          icon: "success",
          title: "¡Completado!",
          text: "Ejercicio  registrado.",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        setDownloading(false);
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Ha ocurrido un error.",
          text: "Por favor, intentelo mas tarde.",
          confirmButtonText: "Aceptar",
        });
      });
  };
  //acordion
  const [open, setOpen] = useState("1");
  const toggleAcordion = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };
  //Modal actualizar ejercicio
  const [modalUpdate, setModalUpdate] = useState(false);
  const toggleUpdate = () => {
    setEjercicio({
      nombre: "",
      descripcion: "",
      tipoEjercicio: "",
      musculaturaTrabajada: "",
      instrucciones: "",
      video: "",
      equipamientos: [], // Agregar un array para guardar
    });
    setModalUpdate(!modalUpdate);
  };
  //Abrir modal y cargar ejercicio
  const handleOpciones = (ejercicio) => {
    toggleUpdate();
    setEjercicio(ejercicio);
    setTimeout(() => {
      ejercicio.equipamientos?.forEach((equipamiento) => {
        const input = document.getElementById(
          `equipamiento-${equipamiento.id}`
        );
        if (input) {
          input.checked = !input.checked; // Cambiar el estado del checkbox
        } else {
          console.error(`No se encontró un input con el ID `);
        }
      });
    }, 500);
  };

  //Actualizar ejercicio
  const actualizarEjercicio = (e) => {
    e.preventDefault();
    setDownloading(true);
    updateEjercicio(ejercicio)
      .then((res) => res.json())
      .then((data) => {
        toggleUpdate();
        listadoEjercicios();
        setDownloading(false);
        Swal.fire({
          icon: "success",
          title: "¡Completado!",
          text: "Ejercicio  actualizado.",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        setDownloading(false);
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Ha ocurrido un error.",
          text: "Por favor, intentelo mas tarde.",
          confirmButtonText: "Aceptar",
        });
      });
  };
  /*
  #######---RUTINAS----------#################################################################3#######
  */
  //Lista de rutinas
  //const [rutinas, setRuntinas] = useState([]);

  // useEffect(() => {
  //   listadoRutinas();
  // }, []);

  //Busco la lista de rutinas
  const listadoRutinas = async () => {
    setLoading(true);
    listaRutinas()
      .then((res) => res.json())
      .then((data) => {
        setRutinas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  const [filtroRutina, setFiltroRutina] = useState("");
  //Filtro de la tabla
  const filtroRutinas = rutinas.filter(
    (rutina) =>
      rutina?.musculo?.toLowerCase().includes(filtroRutina.toLowerCase())
    //
  );

  //Rutina
  const [rutina, setRutina] = useState({
    nombre: "",
    descripcion: "",
    duracion: "",
    ejercicios: [], // Agregar un array para guardar
  });
  //Modal registrar rutina
  const [modalRutina, setModalRutina] = useState(false);
  const toggleRutina = () => {
    setRutina([]);
    setModalRutina(!modalRutina);
  };
  //Actualizar campos del modal
  const handleChangeRutina = (e) => {
    const { name, value, type, checked } = e.target;
    const ejercicio = {
      id: Number(value),
    };
    if (type === "checkbox") {
      // Si es un campo de tipo checkbox, gestionar las selecciones
      setRutina((prevRutina) => {
        const ejercicios = prevRutina.ejercicios || []; // Inicializar ejercicios como un array vacío si no existe
        if (checked) {
          // Agregar el ejercicio seleccionado al array
          return { ...prevRutina, ejercicios: [...ejercicios, ejercicio] };
        } else {
          // Eliminar el ejercicio deseleccionado del array
          return {
            ...prevRutina,
            ejercicios: ejercicios.filter((item) => item.id !== ejercicio.id),
          };
        }
      });
    } else {
      // Para otros campos, simplemente actualizar el valor
      setRutina((prevRutina) => ({ ...prevRutina, [name]: value }));
    }
  };

  const registrarRutina = (e) => {
    e.preventDefault();
    setDownloading(true);
    saveRutina(rutina)
      .then((res) => res.json())
      .then((data) => {
        listadoRutinas();
        setDownloading(false);
        toggleRutina();
        Swal.fire({
          icon: "success",
          title: "¡Completado!",
          text: "Ejercicio  registrado.",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        setDownloading(false);
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Ha ocurrido un error.",
          text: "Por favor, intentelo mas tarde.",
          confirmButtonText: "Aceptar",
        });
      });
  };
  const handleOpcionesRutina = (rutina) => {
    toggleRutinaUpdate();
    setRutina(rutina);

    setTimeout(() => {
      rutina.ejercicios?.forEach((ejercicio) => {
        const input = document.getElementById(`ejercicio-${ejercicio.id}`);
        if (input) {
          input.checked = !input.checked; // Cambiar el estado del checkbox
        } else {
          console.error(`No se encontró un input con el ID `);
        }
      });
    }, 500);
  };
  //Modal actulizar Rutina
  const [modalRutinaUpdate, setModalRutinaUpdate] = useState(false);
  const toggleRutinaUpdate = () => {
    setRutina([]);
    setModalRutinaUpdate(!modalRutinaUpdate);
  };

  const actualizarRutina = (e) => {
    e.preventDefault();
    setDownloading(true);

    updateRutina(rutina)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDownloading(false);
        listadoRutinas();
        toggleRutinaUpdate();
        Swal.fire({
          icon: "success",
          title: "¡Completado!",
          text: "Ejercicio  registrado.",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        setDownloading(false);
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Ha ocurrido un error.",
          text: "Por favor, intentelo mas tarde.",
          confirmButtonText: "Aceptar",
        });
      });
  };
  const [musculoSeleccionado, setMusculoSeleccionado] = useState("");

  const handleSelectChange = (event) => {
    const nuevoValor = event.target.value;
    setMusculoSeleccionado(nuevoValor);
  };


  const registrarMusculo= async()=>{
    const { value: musculo } = await Swal.fire({
      title: "Registrar Musculo",
      input: "text",
      inputLabel: "Musculo",
      inputPlaceholder: "Ingresa el nombre"
    });
    if (musculo) {
      setDownloading(true)
      const musculoNew={
        nombre:musculo
      }
      saveMusculo(musculoNew)
      .then(res=>res.json())
      .then(data=>{
        listadoMusculos()
        Swal.fire(`Musculo: ${musculo} Registrado`);
      })
      .catch(e=>{
       
        listadoMusculos()
        Swal.fire(`Error Musculo: ${musculo} ya esta Registrado`);

      })
      .finally(f=>{
        setDownloading(false)
      })
      
    }
  }
  const handleEliminarRutina = (rutina) => {
    Swal.fire({
      title: "Eliminar Rutina?",
      text: "Todos los clientes perderan su rutina !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        setDownloading(true);
        deleteRutina(rutina.id)
          .then((res) => res.json())
          .then((data) => {
            listadoRutinas();
            Swal.fire({
              icon: "success",
              title: "¡Completado!",
              text: "Rutina Eliminada.",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((e) => {
            console.log(e);
            Swal.fire({
              title: "Error!",
              text: "intenta mas tarde.",
              icon: "error",
            });
          })
          .finally((f) => {
            setDownloading(false);
          });
      }
    });
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Contenido */}

        <Row>
          <Col className=" " xl="12">
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
                        RUTINAS
                        {tabs === 1 && (
                          <div
                            style={{
                              position: "relative",
                              transform: "translateY(3px)",
                            }}
                          >
                            <MagicTabSelect
                              id="underline"
                              transition={{ type: "spring", bounce: 0.3 }}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: "0.15rem",
                                  backgroundColor: "black",
                                  position: "absolute",
                                }}
                              />
                            </MagicTabSelect>
                          </div>
                        )}
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
                        EJERCICIOS
                        {tabs === 2 && (
                          <div
                            style={{
                              position: "relative",
                              transform: "translateY(3px)",
                            }}
                          >
                            <MagicTabSelect
                              id="underline"
                              transition={{ type: "spring", bounce: 0.3 }}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: "0.15rem",
                                  backgroundColor: "black",
                                  position: "absolute",
                                }}
                              />
                            </MagicTabSelect>
                          </div>
                        )}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        aria-selected={tabs === 3}
                        className={classnames("mb-sm-3 mb-md-0", {
                          active: tabs === 3,
                        })}
                        onClick={() => toggleNavs(3)}
                        role="tab"
                      >
                        <i className="ni ni-calendar-grid-58 mr-2" />
                        EQUIPAMIENTO
                        {tabs === 3 && (
                          <div
                            style={{
                              position: "relative",
                              transform: "translateY(3px)",
                            }}
                          >
                            <MagicTabSelect
                              id="underline"
                              transition={{ type: "spring", bounce: 0.3 }}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: "0.15rem",
                                  backgroundColor: "black",
                                  position: "absolute",
                                }}
                              />
                            </MagicTabSelect>
                          </div>
                        )}
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>

                <Card className="shadow">
                  <CardBody>
                    <TabContent activeTab={"tabs" + tabs}>
                      <TabPane tabId="tabs1">
                        <Row className="align-items-center">
                          <div className="col">
                            <h3 className="mb-0">
                              LISTA DE RUTINAS - Items : {rutinas.length}
                            </h3>
                          </div>
                          <div className="col text-right">
                            <Link title="Registrar">
                              <Button
                                color="primary"
                                type="submit"
                                onClick={toggleRutina}
                              >
                                <i className="fa fa-plus" />
                              </Button>
                            </Link>
                          </div>
                        </Row>
                        <FormGroup
                          row
                          className="justify-content-end mr-2 mt-3"
                        >
                          <Label
                            for="filtro"
                            sm={3}
                            className="form-control-label text-primary"
                          >
                            BUSCAR :
                          </Label>

                          {/* <Col sm={4}>
                            <Input
                              type="text"
                              className="text-dark fw-bold"
                              placeholder="Ingrese el Nombre de la Rutina..."
                              value={filtroRutina}
                              onChange={(e) => setFiltroRutina(e.target.value)}
                            />
                          </Col> */}
                          <Col sm={9}>
                            <FormGroup>
                              <Input
                                type="select"
                                name="musculoRutina"
                                id="musculoRutina"
                                className="form-control text-dark" // Clase Bootstrap para selects
                                value={filtroRutina} // Establece el valor del select según el estado
                                onChange={(e) =>
                                  setFiltroRutina(e.target.value)
                                }
                              >
                                <option value="">
                                  Clasificar por musculatura
                                </option>
                                <option value="cuadriceps">Cuádriceps</option>
                                <option value="pectoral">Pectorales</option>
                                <option value="biceps">Bíceps</option>
                                <option value="espalda-baja">
                                  Espalda Baja
                                </option>
                                <option value="abdominales">Abdominales</option>
                                <option value="hombros">Hombros</option>
                                <option value="gluteos">Glúteos</option>
                                <option value="isquiotibiales">
                                  Isquiotibiales
                                </option>
                                <option value="trapecios">Trapecios</option>
                                {/* Agrega más opciones según tus necesidades */}
                              </Input>
                            </FormGroup>
                          </Col>
                        </FormGroup>
                        <hr className="my-4" />
                        {loading ? (
                          <SpinnerGrupo />
                        ) : (
                          <>
                            {rutinas && (
                              <div>
                                {filtroRutinas.map((rutina, index) => (
                                  <>
                                    <CardTitle tag="h1" className="text">
                                      <Row className="aling-items-center">
                                        <div className="col  ">
                                          <h3 className="mb-0 mt-3 text-dark fw-bold">
                                            <small className="h2 text-primary">{index+1}</small> RUTINA{" "}
                                            {rutina.nombre.toUpperCase()}
                                          </h3>
                                        </div>
                                        <div className="col text-right">
                                          <Link
                                            title="Actualizar"
                                            className="fw-bold h1 text-primary  mr-2"
                                            type="submit"
                                            onClick={() =>
                                              handleOpcionesRutina(rutina)
                                            }
                                          >
                                            <i className="fa-regular fa-pen-to-square" />{" "}
                                          </Link>
                                          <Link
                                            title="Eliminar"
                                            className="fw-bold h1 text-danger "
                                            onClick={() =>
                                              handleEliminarRutina(rutina)
                                            }
                                          >
                                            <i className="fa fa-trash" />{" "}
                                          </Link>
                                        </div>
                                      </Row>
                                    </CardTitle>
                                    <Row>
                                      <Col lg="6">
                                        <CardTitle
                                          tag="h3"
                                          className=" text-primary mb-0"
                                        >
                                          Musculo a trabajar
                                        </CardTitle>
                                        <CardText className="text-dark fw-bold">
                                          {rutina?.musculo?.toUpperCase()}
                                        </CardText>
                                      </Col>
                                      <Col lg="6">
                                        <CardTitle
                                          tag="h3"
                                          className=" text-primary mb-0"
                                        >
                                          Duracion
                                        </CardTitle>
                                        <CardText className="text-dark fw-bold">
                                          {rutina.duracion}
                                        </CardText>
                                      </Col>
                                      <Col lg="12">
                                        <CardTitle
                                          tag="h3"
                                          className=" text-primary mb-0"
                                        >
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
                                              src={convertToEmbedUrl(
                                                ejercicio.video
                                              )}
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
                                    <hr />
                                  </>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </TabPane>

                      {/* Listado de ejericios */}
                      <TabPane tabId="tabs2">
                        <Row className="align-items-center">
                          <div className="col">
                            <h3 className="mb-0">
                              LISTA DE EJERCICIOS - Items : {ejercicios.length}
                            </h3>
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
                          className="justify-content-end mr-2 mt-3"
                        >
                          <Label
                            for="filtro"
                            sm={3}
                            className="form-control-label text-primary"
                          >
                            BUSCAR :
                          </Label>

                          <Col sm={9}>
                            <Input
                              type="text"
                              className="text-dark fw-bold"
                              placeholder="Ingrese el Nombre del Ejercicio..."
                              value={filtroEjercicio}
                              onChange={(e) =>
                                setFiltroEjercicio(e.target.value)
                              }
                            />
                          </Col>
                        </FormGroup>
                        <hr className="my-4" />
                        {loading2 ? (
                          <SpinnerGrupo />
                        ) : (
                          <>
                            {ejercicios && (
                              <>
                                {filtroEjercicios.map((ejercicio) => (
                                  <>
                                    <CardTitle tag="h1" className="text">
                                      <Row className="aling-items-center">
                                        <div className="col  ">
                                          <h3 className="mb-0 mt-3">
                                            {ejercicio.nombre.toUpperCase()}
                                          </h3>
                                        </div>
                                        <div className="col text-right">
                                          <Link title="Actualizar">
                                            <Button
                                              className="fw-bold h2"
                                              color="primary"
                                              type="submit"
                                              onClick={() =>
                                                handleOpciones(ejercicio)
                                              }
                                            >
                                              <i className="fa-regular fa-pen-to-square" />{" "}
                                            </Button>
                                          </Link>
                                        </div>
                                      </Row>
                                    </CardTitle>
                                    <CardText className="text-dark fw-bold">
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

                                    <CardText>
                                      <small className="text-muted">
                                        <a href={ejercicio.video}>
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
                                            src={convertToEmbedUrl(
                                              ejercicio.video
                                            )}
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

                                    <hr />
                                  </>
                                ))}
                              </>
                            )}
                          </>
                        )}
                      </TabPane>
                      <TabPane tabId="tabs3">
                        <Row className="align-items-center">
                          <div className="col">
                            <h3 className="mb-0">
                              LISTA DE EQUIPAMIENTOS - Items :{" "}
                              {equipamientos.length}
                            </h3>
                          </div>
                          <div className="col text-right">
                            <Link title="Registrar">
                              <Button
                                color="primary"
                                type="submit"
                                onClick={toggleSave}
                              >
                                <i className="fa fa-plus" />
                              </Button>{" "}
                            </Link>
                          </div>
                        </Row>
                        <Collapse isOpen={isOpen} className="mt-3">
                          <Card>
                            <CardBody>
                              <h3 className="text-center text-uppercase">
                                Registrar Equipameinto
                              </h3>
                              <hr />
                              <Form onSubmit={guardarEquipamiento}>
                                <Row className="text-center">
                                  <Col sm="4">
                                    <FormGroup>
                                      <Label
                                        for="filtro"
                                        className="form-control-label text-primary"
                                      >
                                        Nombre
                                      </Label>
                                      <Input
                                        type="text"
                                        className="text-dark fw-bold text-center"
                                        placeholder="Ingrese el nombre del equipamiento"
                                        name="nombre"
                                        id="nombre"
                                        required
                                      />
                                    </FormGroup>
                                  </Col>

                                  <Col lg="4">
                                    <FormGroup>
                                      <label
                                        className="form-control-label text-primary"
                                        htmlFor="input-first-name"
                                      >
                                        Cantidad
                                      </label>
                                      <Input
                                        className=" fw-bold text-center text-dark"
                                        id="cantidad"
                                        name="cantidad"
                                        placeholder="Ingrese la cantidad"
                                        type="number"
                                        min={1}
                                        required
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg="4">
                                    <FormGroup check className="text-center ">
                                      <label
                                        className="form-control-label text-primary"
                                        htmlFor="input-first-name"
                                      >
                                        Equipos Disponibles
                                      </label>
                                      <Input
                                        className="text-dark fw-bold text-center"
                                        min={0}
                                        type="number"
                                        name="disponibilidad"
                                        id="disponibilidad"
                                        placeholder="Ingrese la Disponibilidad"
                                      />{" "}
                                    </FormGroup>
                                  </Col>

                                  <Col sm="12" className="mt-3">
                                    <Button color="primary" type="submit">
                                      GUARDAR
                                    </Button>
                                  </Col>
                                </Row>
                              </Form>
                              {equipamientoError && (
                                <p className="text-center text-red">
                                  {" "}
                                  Disponiblidad debe ser menor o igual a la
                                  cantidad
                                </p>
                              )}
                              <hr />
                            </CardBody>
                          </Card>
                        </Collapse>
                        <FormGroup
                          row
                          className="justify-content-end mr-2 mt-3"
                        >
                          <Label
                            for="filtro"
                            sm={3}
                            className="form-control-label text-primary"
                          >
                            BUSCAR :
                          </Label>

                          <Col sm={9}>
                            <Input
                              type="text"
                              className="text-dark fw-bold"
                              placeholder="Ingrese el Nombre del equipamiento..."
                              value={filtro}
                              onChange={(e) => setFiltro(e.target.value)}
                            />
                          </Col>
                        </FormGroup>
                        <hr className="my-4" />
                        {loading3 ? (
                          <SpinnerGrupo />
                        ) : (
                          <Row>
                            <>
                              <DataTable
                                theme={customTheme}
                                customStyles={customStyles}
                                columns={columns}
                                data={filtroEquipamiento}
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
                    </TabContent>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Modal registrar ejercicio */}
      <Modal className="modal-dialog" size="xl" isOpen={modal} toggle={toggle}>
        <div className="modal-body p-0">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-0 d-flex justify-content-between">
              <div
                className="text-muted text-center mt-2 mb-3"
                style={{ flex: 1, textAlign: "center" }}
              >
                <h2 className="text-uppercase">Registrar Ejercicio</h2>
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
            <Form
              onSubmit={registrarEjercicio}
              //onSubmit={registrarEntrenador}
            >
              <CardBody className="px-lg-3 py-lg-2">
                {ejercicio && (
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
                          placeholder="Sentadillas"
                          value={ejercicio.nombre}
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
                          placeholder="Las sentadillas son un ejercicio básico que trabaja los músculos de las piernas y glúteos."
                          type="text"
                          value={ejercicio.descripcion}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <Label
                          for="tipoEjercicio"
                          className="form-control-label"
                        >
                          Tipo de Ejercicio:
                        </Label>
                        <Input
                          type="select"
                          name="tipoEjercicio"
                          id="tipoEjercicio"
                          className="form-control text-dark fw-bold" // Clase Bootstrap para selects
                          value={ejercicio.tipoEjercicio} // Establece el valor seleccionado
                          onChange={handleChange}
                          required
                        >
                          <option value="">
                            Selecciona un tipo de ejercicio
                          </option>
                          <option value="compuesto">Ejercicio Compuesto</option>
                          <option value="aislado">Ejercicio Aislado</option>
                          <option value="isométrico">
                            Ejercicio Isométrico
                          </option>
                          <option value="flexibilidad">
                            Ejercicio de Flexibilidad
                          </option>
                          <option value="cardio">
                            Ejercicio de Cardio y Resistencia
                          </option>
                          <option value="equilibrio">
                            Ejercicio de Equilibrio y Estabilidad
                          </option>
                          <option value="potencia">
                            Ejercicio de Potencia
                          </option>
                          <option value="resistencia-localizada">
                            Resistencia Muscular Localizada
                          </option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col lg="6">
                      <FormGroup>
                        <Label
                          for="musculaturaTrabajada"
                          className="form-control-label"
                        >
                          Musculatura Trabajada: <Link title="Registrar Musculo" className="h3" onClick={registrarMusculo}><i class="fa fa-plus-circle" aria-hidden="true"></i></Link>
                        </Label>
                        <Input
                          type="select"
                          name="musculaturaTrabajada"
                          id="musculaturaTrabajada"
                          className="form-control text-dark fw-bold" // Clase Bootstrap para selects
                          value={ejercicio.musculaturaTrabajada} // Establece el valor seleccionado
                          onChange={handleChange}
                          required
                        >
                           <option value="" >Todos los musculos</option>
                         {musculos.length>0 && (
                          <>
                          {musculos.map((musculo)=>(
                          
                          <option value={musculo.nombre} key={musculo.id}>{musculo.nombre}</option>
                         ))}
                          </>
                         )}
                          {/* Agrega más opciones según tus necesidades */}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="email">
                          Instrucciones
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="instrucciones"
                          name="instrucciones"
                          placeholder="Coloca una barra con pesas en la parte superior de la espalda y de pie con los pies al ancho de los hombros. Flexiona las rodillas y las caderas para bajar el cuerpo como si te estuvieras sentando en una silla"
                          type="textarea"
                          value={ejercicio.instrucciones}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="cedula">
                          Link video (Youtube)
                        </label>
                        <Input
                          className="form-control-alternative text-dark fw-bold"
                          id="video"
                          name="video"
                          placeholder="https://www.youtube.com/watch?v=ultWZbUMPL8"
                          type="text"
                          value={ejercicio.video}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="cedula">
                          Equipamientos
                        </label>
                      </FormGroup>
                      {equipamientos && (
                        <>
                          {equipamientos.map((equipamiento) => (
                            <FormGroup check inline key={equipamiento.id}>
                              <Input
                                className="text-dark fw-bold"
                                type="checkbox"
                                value={equipamiento.id}
                                name={`equipamientos`}
                                id={`equipamiento-${equipamiento.id}`}
                                onChange={handleChange}
                              />
                              <Label check>{equipamiento.nombre}</Label>
                            </FormGroup>
                          ))}
                        </>
                      )}
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
      {/* Modal actualizar ejercicio */}
      <Modal
        className="modal-dialog"
        size="xl"
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
                <h2 className="text-uppercase">Actualizar Ejercicio</h2>
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
            <Form
              onSubmit={actualizarEjercicio}
              //onSubmit={registrarEntrenador}
            >
              <CardBody className="px-lg-3 py-lg-2">
                {ejercicio && (
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="nombre">
                          Nombre
                        </label>
                        <Input
                          className="form-control-alternative text-dark"
                          id="nombre"
                          name="nombre"
                          placeholder="Marlon"
                          value={ejercicio.nombre}
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
                          className="form-control-alternative text-dark"
                          id="descripcion"
                          name="descripcion"
                          placeholder="jesse@example.com"
                          type="text"
                          value={ejercicio.descripcion}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <Label
                          for="tipoEjercicio"
                          className="form-control-label"
                        >
                          Tipo de Ejercicio:
                        </Label>
                        <Input
                          type="select"
                          name="tipoEjercicio"
                          id="tipoEjercicio"
                          className="form-control text-dark" // Clase Bootstrap para selects
                          value={ejercicio.tipoEjercicio} // Establece el valor seleccionado
                          onChange={handleChange}
                          required
                        >
                          <option value="">
                            Selecciona un tipo de ejercicio
                          </option>
                          <option value="compuesto">Ejercicio Compuesto</option>
                          <option value="aislado">Ejercicio Aislado</option>
                          <option value="isométrico">
                            Ejercicio Isométrico
                          </option>
                          <option value="flexibilidad">
                            Ejercicio de Flexibilidad
                          </option>
                          <option value="cardio">
                            Ejercicio de Cardio y Resistencia
                          </option>
                          <option value="equilibrio">
                            Ejercicio de Equilibrio y Estabilidad
                          </option>
                          <option value="potencia">
                            Ejercicio de Potencia
                          </option>
                          <option value="resistencia-localizada">
                            Resistencia Muscular Localizada
                          </option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col lg="6">
                      <FormGroup>
                        <Label
                          for="musculaturaTrabajada"
                          className="form-control-label"
                        >
                          Musculatura Trabajada:
                        </Label>
                        <Input
                          type="select"
                          name="musculaturaTrabajada"
                          id="musculaturaTrabajada"
                          className="form-control text-dark" // Clase Bootstrap para selects
                          value={ejercicio.musculaturaTrabajada} // Establece el valor seleccionado
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecciona una musculatura</option>
                          <option value="cuadriceps">Cuádriceps</option>
                          <option value="pectoral">Pectorales</option>
                          <option value="biceps">Bíceps</option>
                          <option value="espalda-baja">Espalda Baja</option>
                          <option value="abdominales">Abdominales</option>
                          <option value="hombros">Hombros</option>
                          <option value="gluteos">Glúteos</option>
                          <option value="isquiotibiales">Isquiotibiales</option>
                          <option value="trapecios">Trapecios</option>
                          {/* Agrega más opciones según tus necesidades */}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="email">
                          Instrucciones
                        </label>
                        <Input
                          className="form-control-alternative text-dark"
                          id="instrucciones"
                          name="instrucciones"
                          placeholder="jesse@example.com"
                          type="textarea"
                          value={ejercicio.instrucciones}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="cedula">
                          Link video (Youtube)
                        </label>
                        <Input
                          className="form-control-alternative text-dark"
                          id="video"
                          name="video"
                          placeholder="https://www.youtube.com/watch?v=ultWZbUMPL8"
                          type="text"
                          value={ejercicio.video}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="12">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="cedula">
                          Equipamientos
                        </label>
                      </FormGroup>
                      {equipamientos && (
                        <>
                          {equipamientos.map((equipamiento) => (
                            <FormGroup check inline key={equipamiento.id}>
                              <Input
                                className="text-dark"
                                type="checkbox"
                                value={equipamiento.id}
                                name={`equipamientos`}
                                id={`equipamiento-${equipamiento.id}`}
                                onChange={handleChange}

                                //checked={!!ejercicio.equipamientos.find((item) => item.id === equipamiento.id)  }
                              />
                              <Label check>{equipamiento.nombre}</Label>
                            </FormGroup>
                          ))}
                        </>
                      )}
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
      {/* Modal registrar Rutina */}
      <Modal
        className="modal-dialog"
        size="lg"
        isOpen={modalRutina}
        toggle={toggleRutina}
      >
        <div className="modal-body p-0">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-0 d-flex justify-content-between">
              <div
                className="text-muted text-center mt-2 mb-3"
                style={{ flex: 1, textAlign: "center" }}
              >
                <h2>Registrar Rutina</h2>
              </div>
              <button
                className="btn btn-close text-dark"
                style={{
                  backgroundColor: "transparent", // Color de fondo del botón transparente
                  border: "none",
                }}
                onClick={toggleRutina}
              >
                <i class="fa fa-times-circle" aria-hidden="true"></i>
              </button>
            </CardHeader>
            <Form
              onSubmit={registrarRutina}
              //onSubmit={registrarEntrenador}
            >
              <CardBody className="px-lg-3 py-lg-2">
                {rutina && (
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label fw-bold text-primary"
                          htmlFor="nombre"
                        >
                          Nombre
                        </label>
                        <Input
                          className="form-control-alternativefw-bold text-dark"
                          id="nombre"
                          name="nombre"
                          placeholder="Fuerza Total"
                          value={rutina.nombre}
                          onChange={handleChangeRutina}
                          type="text"
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label fw-bold text-primary"
                          htmlFor="email"
                        >
                          Descripcion
                        </label>
                        <Input
                          className="form-control-alternative fw-bold text-dark"
                          id="descripcion"
                          name="descripcion"
                          placeholder="Esta rutina se enfoca en desarrollar fuerza en todo el cuerpo. Es ideal para quienes desean aumentar su masa muscular y mejorar la fuerza general."
                          type="textarea"
                          value={rutina.descripcion}
                          onChange={handleChangeRutina}
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
                          Duracion
                        </label>
                        <Input
                          className="form-control-alternative fw-bold text-dark"
                          id="duracion"
                          name="duracion"
                          placeholder="4 Meses"
                          type="text"
                          value={rutina.duracion}
                          onChange={handleChangeRutina}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <Label
                          for="musculaturaTrabajada"
                          className="form-control-label fw-bold text-primary"
                        >
                          Musculatura Trabajada: <Link title="Registrar Musculo" className="h3" onClick={registrarMusculo}><i class="fa fa-plus-circle" aria-hidden="true"></i></Link>
                        </Label>
                        <Input
                          type="select"
                          name="musculo"
                          id="musculo"
                          className="form-control text-dark" // Clase Bootstrap para selects
                          value={rutina.musculo} // Establece el valor seleccionado
                          onChange={handleChangeRutina}
                          required
                        >
                        <option value="" >Todos los musculos</option>
                         {musculos.length>0 && (
                          <>
                          {musculos.map((musculo)=>(
                          
                          <option value={musculo.nombre} key={musculo.id}>{musculo.nombre}</option>
                         ))}
                          </>
                         )}
                          {/* Agrega más opciones según tus necesidades */}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label fw-bold text-primary"
                          htmlFor="cedula"
                        >
                          Ejercicios
                        </label>
                      </FormGroup>
                      {ejercicios && (
                        <>
                          {ejercicios.map((ejercicio) => (
                            <FormGroup check inline key={ejercicio.id}>
                              <Input
                                className="fw-bold text-dark"
                                type="checkbox"
                                value={ejercicio.id}
                                name={`ejercicios`}
                                id={`ejercicio-${ejercicio.id}`}
                                onChange={handleChangeRutina}
                              />
                              <Label check>{ejercicio.nombre}</Label>
                            </FormGroup>
                          ))}
                        </>
                      )}
                    </Col>
                  </Row>
                )}
              </CardBody>
              <CardFooter className="d-flex justify-content-between">
                <Button
                  className="btn-white"
                  color="default"
                  onClick={toggleRutina}
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
      {/* Modal actualizar Rutina */}
      <Modal
        className="modal-dialog"
        size="lg"
        isOpen={modalRutinaUpdate}
        toggle={toggleRutinaUpdate}
      >
        <div className="modal-body p-0">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-0 d-flex justify-content-between">
              <div
                className="text-muted text-center mt-2 mb-3"
                style={{ flex: 1, textAlign: "center" }}
              >
                <h2>Actualizar Rutina</h2>
              </div>
              <button
                className="btn btn-close text-dark"
                style={{
                  backgroundColor: "transparent", // Color de fondo del botón transparente
                  border: "none",
                }}
                onClick={toggleRutinaUpdate}
              >
                <i class="fa fa-times-circle" aria-hidden="true"></i>
              </button>
            </CardHeader>
            <Form
              onSubmit={actualizarRutina}
              //onSubmit={registrarEntrenador}
            >
              <CardBody className="px-lg-3 py-lg-2">
                {rutina && (
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label fw-bold text-primary"
                          htmlFor="nombre"
                        >
                          Nombre
                        </label>
                        <Input
                          className="form-control-alternative fw-bold text-dark"
                          id="nombre"
                          name="nombre"
                          placeholder="Marlon"
                          value={rutina.nombre}
                          onChange={handleChangeRutina}
                          type="text"
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label fw-bold text-primary"
                          htmlFor="email"
                        >
                          Descripcion
                        </label>
                        <Input
                          className="form-control-alternative fw-bold text-dark"
                          id="descripcion"
                          name="descripcion"
                          placeholder="jesse@example.com"
                          type="textarea"
                          value={rutina.descripcion}
                          onChange={handleChangeRutina}
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
                          Duracion
                        </label>
                        <Input
                          className="form-control-alternative fw-bold text-dark"
                          id="duracion"
                          name="duracion"
                          placeholder="jesse@example.com"
                          type="text"
                          value={rutina.duracion}
                          onChange={handleChangeRutina}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <Label
                          for="musculaturaTrabajada"
                          className="form-control-label fw-bold text-primary"
                        >
                          Musculatura Trabajada:
                        </Label>
                        <Input
                          type="select"
                          name="musculo"
                          id="musculo"
                          className="form-control text-dark" // Clase Bootstrap para selects
                          value={rutina.musculo} // Establece el valor seleccionado
                          onChange={handleChangeRutina}
                          required
                        >
                          <option value="">Selecciona una musculatura</option>
                          <option value="cuadriceps">Cuádriceps</option>
                          <option value="pectoral">Pectorales</option>
                          <option value="biceps">Bíceps</option>
                          <option value="espalda-baja">Espalda Baja</option>
                          <option value="abdominales">Abdominales</option>
                          <option value="hombros">Hombros</option>
                          <option value="gluteos">Glúteos</option>
                          <option value="isquiotibiales">Isquiotibiales</option>
                          <option value="trapecios">Trapecios</option>
                          {/* Agrega más opciones según tus necesidades */}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label fw-bold text-primary"
                          htmlFor="cedula"
                        >
                          Ejercicios
                        </label>
                      </FormGroup>
                      {ejercicios && (
                        <>
                          {ejercicios.map((ejercicio) => (
                            <FormGroup check inline key={ejercicio.id}>
                              <Input
                                className="fw-bold text-dark"
                                type="checkbox"
                                value={ejercicio.id}
                                name={`ejercicios`}
                                id={`ejercicio-${ejercicio.id}`}
                                onChange={handleChangeRutina}
                              />
                              <Label check>{ejercicio.nombre}</Label>
                            </FormGroup>
                          ))}
                        </>
                      )}
                    </Col>
                  </Row>
                )}
              </CardBody>
              <CardFooter className="d-flex justify-content-between">
                <Button
                  className="btn-white"
                  color="default"
                  onClick={toggleRutinaUpdate}
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
    </>
  );
};

export default Rutinas;
