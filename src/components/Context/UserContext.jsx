import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getMembresiaId,
  listaMembresia,
  listaMembresiaActivas,
  listaUsuarioMembresia,
  usuarioMembresiaByCedula,
  usuarioMembresiasEntrenador,
} from "../../api/Membresia/Membresia";
import {
  asitenciaRegistrada,
  datosAsitencias,
  listaAsistencia,
} from "../../api/Asistencias/Asistencia";
import logoUser from "../../assets/img/user.png";
import { downloadImagenPerfil } from "../../api/Perfil/Perfil";
import { getEntrenador } from "../../api/Entrenador/Entrenador";
import {
  listaImagenPublicidad,
  downloadImagenPublicidad,
  getCorporativo,
  downloadLogo,
  downloadHorario,
} from "../../api/Corporativo/Corporativo";
import { listaEjercicios } from "../../api/Rutinas/Ejercicios";
import { listaRutinas } from "../../api/Rutinas/Rutinas";
import { listaUsuarioRol } from "../../api/Usuarios/Usuario";
import { getRutinasDelCliente } from "../../api/Medidas/Medidas";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  /*
     MODULO  INICIO -- PUBLICIDADES
  */
  //Informacion de la corporacion
  const [logoImg, setLogoImg] = useState("");
  const [horario, setHorario] = useState("");

  const [corporativo, setCorporativo] = useState([]);
  const obtenerInformacionCorporativa = async () => {
    try {
      getCorporativo()
        .then((res) => res.json())
        .then((data) => {
          setCorporativo(data);
          if (data.logo !== null) {
            getLogo(data.logo);
          }
          if (data.horario !== null) {
            getHorario(data.horario);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getLogo = async (key) => {
    try {
      const response = await downloadLogo(key);

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob); // Crea una URL para la imagen descargada
        setLogoImg(imageUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getHorario = async (key) => {
    try {
      const response = await downloadHorario(key);

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob); // Crea una URL para la imagen descargada
        setHorario(imageUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
      MODULOS 
  */
  //MODULO USUARIO
  const modulo = localStorage.getItem("modulo");
  //Informacion del usuario para el perfil (TODOS LOS MODULOS)
  const [usuario, setUsuario] = useState([]);
  //Imagen de perfil del usuario (TODOS LOS MODULOS)
  const [urlImagen, setUrlImagen] = useState(logoUser); //(TODOS LOS MODULOS) Puedes inicializarlo con el valor inicial de la imagen
  //Si es cliente se verifica la membresia
  const [membresiaActiva, setMembresiaActiva] = useState(false); // (MODULO )Puedes inicializarlo con el valor inicial de la imagen
  //Guarda el cliente
  const [cliente, setCliente] = useState([]);
  //Fecha Inicio
  const [fechaInicio, setFechaInicio] = useState("");
  //Fecha Fin
  const [fechaFin, setFechaFin] = useState("");
  //Seleccionar asistencia
  const [asistenciaSeleccionada, setAsistenciaSeleccionada] = useState(true);
  const [time, setTime] = useState(true);
  //Entrenador del cliente
  const [entrenador, setEntrenador] = useState([]);
  //Membresia actual del cliente
  const [membresia, setMembresia] = useState([]);
  //Foto del entrenador
  const [fotoEntrenador, setFotoEntrenador] = useState(logoUser);
  //Lista de ejercicios
  const [ejercicios, setEjercicios] = useState([]);
  //Lista de asistencia
  const [asistencias, setAsistencias] = useState([]);

  //MODULO CLIENTE
  useEffect(() => {
    if (modulo === "cliente") {
      getCliente();
    } else {
      //OTROS MODULOS
      const user = JSON.parse(localStorage.getItem("data"));
      setUsuario(user);
    }
  }, [modulo]);

  //MODULO CLIENTE
  const [membresiaActual, setMembresiaActual] = useState([]);
  useEffect(() => {
    if (membresiaActiva && modulo === "cliente") {
      verificarAsistencia();

      buscarFechas();

      obtenerEntrenador();
      setTimeout(() => {
        listadoAsistencia();
        listaRutinasCliente()
        listadoEjercicios();
      }, 500);
    }
  }, [modulo, membresiaActiva]);
  //TODOS LOS MODULOS
  useEffect(() => {
    if (usuario !== null) getImagenPerfil();
  }, [usuario]);

  const membresiaActualCliente = (id) => {
    getMembresiaId(id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMembresiaActual(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //MODULO ADMIN Y RECEPCINISTA
  useEffect(() => {
    if (modulo === "admin" || modulo === "recepcionista") {
      listadoClientes();
      listadoMembresiasActvias();
    }
  }, [modulo]);
  //MODULO ADMIN
  useEffect(() => {
    if (modulo === "admin") {
      listadoMembresias();

      listadoUsuarios();
      listadoRecepcionista();
      listadoEntrenadores();
    }
  }, [modulo]);
  //TODOS LOS MODULOS
  useEffect(() => {
    if (modulo !== null) {
      obtenerDatos();
      listadoRutinas();
      listadoEjercicios();
    }
  }, [modulo]);
  //publicidad
  useEffect(() => {
    obtenerInformacionCorporativa();
  }, []);
  //Lista de imagenes de publiciddad
  const [publicidades, setPublicidades] = useState([]);
  useEffect(() => {
    listaPublicidades();
  }, []);
  //MODULO ENTRENADOR
  useEffect(() => {
    listadoClientesEntrenador();
  }, []);
  const [clientesEntrenador, setClientesEntrenador] = useState([]);
  const listadoClientesEntrenador = async () => {
    try {
      let id = JSON.parse(localStorage.getItem("data")).id;
      const response = await usuarioMembresiasEntrenador(id);
      const data = await response.json();

      setClientesEntrenador(data);
    } catch (error) {
      console.log(error);
    }
  };
  const [rutinasCliente, setRutinasCliente] = useState([]);
  const listaRutinasCliente = () => {
    const id = JSON.parse(localStorage.getItem("data")).id;
    getRutinasDelCliente(id)
      .then((res) => res.json())
      .then((data) => {
        setRutinasCliente(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const listaPublicidades = async () => {
    try {
      const res = await listaImagenPublicidad();
      const data = await res.json();

      const newData = await Promise.all(
        data.map(async (publicidad) => {
          const imageUrl = await getImagenPublicidad(publicidad.foto);
          return { ...publicidad, url: imageUrl };
        })
      );

      setPublicidades(newData);
    } catch (error) {
      console.log(error);
    }
  };
  const getImagenPublicidad = async (key) => {
    try {
      const response = await downloadImagenPublicidad(key);

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob); // Crea una URL para la imagen descargada
        //console.log(imageUrl);

        return imageUrl;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [dataMembresiaActiva, setDataMembresiaActiva] = useState([]);
  const getCliente = async () => {
    let cedula = JSON.parse(localStorage.getItem("data")).cedula;
    usuarioMembresiaByCedula(cedula)
      .then((res) => res.json())
      .then((data) => {
        setCliente(data);
        setUsuario(data.usuario);
        if (data.usuarioMembresias.length > 0) {
          setMembresiaActiva(true);
        } else {
          setMembresiaActiva(false);
          // localStorage.setItem("token","no valido")
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally((final) => {
        setTime(false);
      });
  };
  const buscarFechas = () => {
    let size = cliente.usuarioMembresias.length;
    setFechaInicio(cliente.usuarioMembresias[0]);
    setFechaFin(cliente.usuarioMembresias[size - 1]);
  };

  const verificarAsistencia = () => {
    asitenciaRegistrada()
      .then((res) => res.json())
      .then((data) => {
        setAsistenciaSeleccionada(data);
      })
      .catch((err) => {
        console.log(err);
      });
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
          // console.log(imageUrl);
        } else {
          console.log("error buscando imagen");
        }
      }
    } catch (error) {}
  };

  const obtenerEntrenador = () => {
    // Obtener la fecha actual
    const fechaActual = new Date();

    // Filtrar las membresías que cumplen con las condiciones
    const membresiasActivas = cliente?.usuarioMembresias.filter((membresia) => {
      const fechaInicio = new Date(membresia.fechaInicio);
      const fechaFin = new Date(membresia.fechaFin);

      return fechaInicio < fechaActual && fechaFin > fechaActual;
    });
    if (membresiasActivas !== null) {
      membresiaActualCliente(membresiasActivas[0].membresiaId);
      setDataMembresiaActiva(membresiasActivas[0]);
      setMembresia(membresiasActivas);
      getEntrenador(membresiasActivas[0].entrenadorId)
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
          }
        })
        .catch((err) => {
          console.log(err);
          //setDownloading(false);
        });
    }
  };

  const listadoAsistencia = () => {
    listaAsistencia()
      .then((response) => response.json())
      .then((data) => {
        setAsistencias(data.reverse());
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const listadoEjercicios = () => {
    listaEjercicios()
      .then((response) => response.json())
      .then((data) => {
        setEjercicios(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [rutinas, setRutinas] = useState([]);
  //Busco la lista de rutinas
  const listadoRutinas = async () => {
    listaRutinas()
      .then((res) => res.json())
      .then((data) => {
        setRutinas(data.reverse());
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [recepcionistas, setRecepcionistas] = useState([]);
  const listadoRecepcionista = async () => {
    try {
      const response = await listaUsuarioRol(4);
      const data = await response.json();

      setRecepcionistas(data);
    } catch (error) {
      console.log(error);
    }
  };
  const [entrenadores, setEntrenadores] = useState([]);
  const listadoEntrenadores = async () => {
    try {
      const response = await listaUsuarioRol(3);
      const data = await response.json();

      setEntrenadores(data);
    } catch (error) {
      console.log(error);
    }
  };

  const [membresias, setMembresias] = useState();
  const [membresiasActivas, setMembresiasActivas] = useState();
  const listadoMembresias = async () => {
    try {
      const response = await listaMembresia();
      const data = await response.json();

      setMembresias(data);
    } catch (error) {
      console.log(error);
    }
  };
  const listadoMembresiasActvias = async () => {
    try {
      const response = await listaMembresiaActivas();
      const data = await response.json();

      setMembresiasActivas(data);
    } catch (error) {
      console.log(error);
    }
  };
  //Lista de usuariosMembresias
  const [usuariosMembresias, setUsuariosMembresias] = useState([]);
  //Listado de usuariosMembresias
  const listadoUsuarios = async () => {
    try {
      const response = await listaUsuarioMembresia();
      const data = await response.json();

      setUsuariosMembresias(data.reverse());
    } catch (error) {
      console.log(error);
    }
  };
  const [clientes, setClientes] = useState([]);
  //LISTADO DE CLIENTES
  const listadoClientes = async () => {
    try {
      const response = await listaUsuarioRol(2); // Asegúrate de que la función listaUsuarioRol esté definida
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.log(error);
    }
  };

  const [datos, setDatos] = useState([]);
  const obtenerDatos = () => {
    //setDownloading(true)
    datosAsitencias()
      .then((res) => res.json())
      .then((data) => {
        setDatos(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <UserContext.Provider
      value={{
        rutinasCliente,setRutinasCliente,
        membresiaActual,
        setMembresiaActual,
        dataMembresiaActiva,
        setDataMembresiaActiva,
        membresiasActivas,
        setMembresiasActivas,
        corporativo,
        setCorporativo,
        logoImg,
        setLogoImg,
        horario,
        setHorario,
        datos,
        setDatos,
        membresias,
        setMembresias,
        clientes,
        setClientes,
        usuariosMembresias,
        setUsuariosMembresias,
        rutinas,
        setRutinas,
        recepcionistas,
        setRecepcionistas,
        entrenadores,
        setEntrenadores,
        publicidades,
        setPublicidades,
        urlImagen,
        setUrlImagen,
        usuario,
        setUsuario,
        membresiaActiva,
        setMembresiaActiva,
        cliente,
        setCliente,
        fechaInicio,
        setFechaInicio,
        fechaFin,
        setFechaFin,
        asistenciaSeleccionada,
        setAsistenciaSeleccionada,
        setTime,
        time,
        entrenador,
        setEntrenador,
        membresia,
        setMembresia,
        fotoEntrenador,
        setFotoEntrenador,
        setAsistencias,
        asistencias,
        ejercicios,
        setEjercicios,
        clientesEntrenador,
        setClientesEntrenador,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
