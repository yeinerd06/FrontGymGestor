import { urlBackend } from "../urlBackend";


async function saveEntrenador(usuario){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"usuario/save/entrenador",{
        method:'POST',
        body:JSON.stringify(usuario),
        headers:{
            "Content-type":"application/json",
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

export {saveEntrenador}