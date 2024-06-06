import { urlBackend } from "./urlBackend";


async function iniciarSesion(usuario){
    const result=await fetch(urlBackend+"user/login",{
        method:'POST',
        body:JSON.stringify(usuario),
        headers:{
            "Content-type":"application/json"
        }
    })
    return result;
}
export {iniciarSesion};