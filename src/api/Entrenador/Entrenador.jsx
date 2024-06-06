import { urlBackend } from "../urlBackend";

async function getEntrenador(id){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"entrenador/"+id,{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

export {getEntrenador}