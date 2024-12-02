import Login from "./view/Inicio/Login";
import Recuperar from "./view/Inicio/Recuperar";
import Registrar from "./view/Inicio/Registrar";

import IndexUser from "./view/Admin/index";
import Cliente from "./view/Admin/Usuarios/Cliente";

import Entrenador from "./view/Admin/Usuarios/Entrenador";

import Recepcionista from "./view/Admin/Usuarios/Recepcionista";

import Membresia from "./view/Admin/Membresias/Membresia";
import Rutinas from "./view/Admin/Rutinas/Runitas";
import Index from "./view/Index/Index";
import EntrenadorUsuarios from "./view/Entrenador/index"
import Corporativo from "./view/Admin/Corporativo/Corporativo" 
import ClienteRutinas from "./view/Client/Rutinas"
import ClienteEjercicios from "./view/Client/Ejercicios"
import ClienteEntrenamientos from "./view/Client/Entrenamiento"
import ClienteRegistrar from "./view/Client/Registrar"
import Perfil from "./view/Perfil/Perfil"
import EntrenadorCliente from "./view/Client/Entrenador"
import MedidasCliente from "./view/Client/Medidas"
var routes = [
  {
    path: "/index",
    name: "Index",
    icon: "fas fa-heart",
    component: <Index />,
    layout: "/auth",
  },
  {
    path: "/login",
    name: "Login",
    icon: "fas fa-heart",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/recuperar",
    name: "Recuperar",
    icon: "fas fa-heart",
    component: <Recuperar />,
    layout: "/auth",
  },
  {
    path: "/registrar",
    name: "Resgistrar",
    icon: "fas fa-heart",
    component: <Registrar />,
    layout: "/auth",
  },
  {
    path: "/index",
    name: "Index",
    icon: "fas  fa-home text-blue",
    component: <IndexUser />,
    layout: "/admin",
  },
  {
    path: "/clientes",
    name: "Clientes",
    icon: "fa fa-users text-green",
    component: <Cliente />,
    layout: "/admin",
  },
  {
    path: "/membresia",
    name: "Membresias",
    icon: "fa fa-credit-card text-purple",
    component: <Membresia />,
    layout: "/admin",
  },
  {
    path: "/corporativo",
    name: "Corporativo",
    
    icon: "fa fa-building text-dark",
    component: <Corporativo />,
    layout: "/admin",
  },
  {
    path: "/perfil",
    name: "Perfil",
    icon:"",
    component: <Perfil />,
    layout: "/admin",
  },
  {
    path: "/entrenador",
    name: "Entrenador",
    icon: "fa fa-graduation-cap text-yellow",
    component: <Entrenador />,
    layout: "/admin",
  },
  {
    path: "/recepcionista",
    name: "Recepcionista",
    icon: "fa fa-address-card text-red",
    component: <Recepcionista />,
    layout: "/admin",
  },
  {
    path: "/rutinas",
    name: "Rutinas",
    icon: "fa fa-flag-checkered text-orange",
    component: <Rutinas />,
    layout: "/admin",
  },
  
  {
    path: "/index",
    name: "Inicio",
    icon: "fas  fa-home text-blue",
    component: <IndexUser />,
    layout: "/cliente",
  },
   {
    path: "/perfil",
    name: "Perfil",
    icon:"",
    component: <Perfil />,
    layout: "/cliente",
  },
  {
    path: "/entrenador",
    name: "Entrenador",
    icon: "fa fa-address-card text-orange",
    component: <EntrenadorCliente />,
    layout: "/cliente",
  },
  {
    path: "/entrenamientos",
    name: "Entrenamientos",
    icon: "fa fa-bolt text-yellow",
    component: <ClienteEntrenamientos />,
    layout: "/cliente",
  },
  {
    path: "/medidas",
    name: "Medidas",
    icon: "fa fa-male text-dark",
    component: <MedidasCliente />,
    layout: "/cliente",
  },
  
  {
    path: "/rutinas",
    name: "Rutinas",
    icon: "fa fa-flag-checkered text-purple",
    component: <ClienteRutinas />,
    layout: "/cliente",
  },
  {
    path: "/ejercicios",
    name: "Ejercicios",
    icon: "fa fa-male text-danger",
    component: <ClienteEjercicios />,
    layout: "/cliente",
  },
  
  {
    path: "/entrenamientos/:id/registrar",
    name: "Entrenamientos",
    icon: "",
    component: <ClienteRegistrar />,
    layout: "/cliente",
  },
  {
    path: "/index",
    name: "Index",
    icon: "fas  fa-home text-blue",
    component: <IndexUser />,
    layout: "/entrenador",
  },
  {
    path: "/perfil",
    name: "Perfil",
    icon:"",
    component: <Perfil />,
    layout: "/entrenador",
  },
  
  {
    path:"/rutinas",
    name:"Rutinas",
    icon:"fa fa-flag-checkered text-red",
    component:<Rutinas/>,
    layout:"/entrenador"

  } ,
  {
    path:"/clientes",
    name:"Clientes",
    icon:"fa fa-users text-yellow",
    component:<EntrenadorUsuarios/>,
    layout:"/entrenador"

  },
  {
    path: "/index",
    name: "Index",
    icon: "fas  fa-home text-blue",
    component: <IndexUser />,
    layout: "/recepcionista",
  },
  {
    path: "/perfil",
    name: "Perfil",
    icon:"",
    component: <Perfil />,
    layout: "/recepcionista",
  },
  {
    path: "/clientes",
    name: "Clientes",
    icon: "fa fa-users text-green",
    component: <Cliente />,
    layout: "/recepcionista",
  },
];

export default routes;
