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
import logoUser from "../../assets/img/user.png";
import { getMedidasCliente, getRutinasDelCliente } from "../../api/Medidas/Medidas";

import DataTable from "react-data-table-component";
import {
  customTheme,
  customStyles,
} from "../../components/Datatable/DatatableCustom";
const Medidas = () => {
  const {
    usuario,
    cliente,
    entrenador,
    membresia,
    fotoEntrenador,
    setFotoEntrenador,
    dataMembresiaActiva,
    setDataMembresiaActiva,
    setEntrenador,
  } = useUserContext();

  const [downloading, setDownloading] = useState(false);
  //Columnas de la Datatable
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
  useEffect(()=>{
    buscarMedidasCliente()
  },[])
  //Lista de medidas del cliente
  const [medidasCliente, setMedidasCliente] = useState([]);

  //Funcion para buscar la lista de medidas del cliente
  const buscarMedidasCliente = () => {
    setDownloading(true);
    const id=JSON.parse(localStorage.getItem("data")).id
    getMedidasCliente(id)
      .then((res) => res.json())
      .then((data) => {
        setMedidasCliente(data.reverse());
      })
      .catch((e) => {
        console.log(e);
      })
      .finally((f) => {
        setDownloading(false);
      });
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
          <Col className="order-xl-1 mt-1" xl="12">
            <Card className="bg-white shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">MEDIDAS </h3>
                  </Col>
                  <div className="col text-right">
                    {/* <Link title="Cambiar Entrenador">
                            <Button
                              size="sm"
                              color="primary"
                              type="submit"
                              className=" fw-bold"
                              onClick={toggleUpdate}
                            >
                              <i className="fa fa-pencil-square " /> Actualizar
                            </Button>
                          </Link> */}
                  </div>
                </Row>
              </CardHeader>

              <CardBody>
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
              </CardBody>
            </Card>
            <hr />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Medidas;
