import { urlBackend } from "../urlBackend";

async function listaUsuarioRol(rol){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"rol/usuario/"+rol,{
        method:"GET",
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}
async function listaUsuarioRolEntrenador(){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"rol/usuario/entrenadores",{
        method:"GET",
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}


async function updateUsuario(usuario){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"usuario/update/"+usuario.id,{
        method:'PUT',
        body:JSON.stringify(usuario),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
    })
    return result;
}

export {listaUsuarioRol,updateUsuario,listaUsuarioRolEntrenador}