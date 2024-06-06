import { urlBackend } from "../urlBackend";


async function saveCliente(usuario){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"usuario/save/cliente",{
        method:'POST',
        body:JSON.stringify(usuario),
        headers:{
            "Content-type":"application/json",
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

export {saveCliente}