import { urlBackend } from "../urlBackend";

async function listaMembresia(){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"membresia",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}
async function listaMembresiaActivas(){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"membresia/activas",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

async function saveMembresia(membresia){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"membresia/save",{
        method:'POST',
        body:JSON.stringify(membresia),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
    })
    return result;
}
async function updateMembresia(membresia){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"membresia/"+membresia.id+"/update",{
        method:'PUT',
        body:JSON.stringify(membresia),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
    })
    return result;
}

async function deleteMembresia(id){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"membresia/"+id,{
        method:'DELETE',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}
async function getMembresiaId(id){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"membresia/"+id,{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}
async function usuarioMembresiaByCedula(cedula){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"usuario/membresia/cedula/"+cedula,{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

async function usuarioMembresiasEntrenador(id){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"usuario/membresia/activa/"+id+"/entrenador",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

async function listaUsuarioMembresia(){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"usuario/membresia",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}
async function listaUsuarioMembresiaInforme(fechaInicio,fechaFin){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"usuario/membresia/informe/"+fechaInicio+"/"+fechaFin,{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

async function saveUsuarioMembresia(usuarioMembresia){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"usuario/membresia/save",{
        method:'POST',
        body:JSON.stringify(usuarioMembresia),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
    })
    return result;
}

async function updateUsuarioMembresia(usuarioMembresia,id){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"usuario/membresia/update/"+id,{
        method:'PUT',
        body:JSON.stringify(usuarioMembresia),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
    })
    return result;
}

async function sendEmailNuevoUsuario(id){
    let token=localStorage.getItem("token")
    const result =await fetch(urlBackend+"mail/new/"+id,{
        method:'POST',
        headers:{
            "Authorization":"Bearer "+token,

        }
    })
    return result;
}

export {
  listaMembresia,
  updateUsuarioMembresia,
  listaMembresiaActivas,
  listaUsuarioMembresia,
  deleteMembresia,
  listaUsuarioMembresiaInforme,
  saveMembresia,
  updateMembresia,
  usuarioMembresiaByCedula,
  getMembresiaId,
  saveUsuarioMembresia,
  sendEmailNuevoUsuario,
  usuarioMembresiasEntrenador,
};