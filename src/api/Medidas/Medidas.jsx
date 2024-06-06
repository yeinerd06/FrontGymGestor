import { urlBackend } from "../urlBackend";

async function getMedidasCliente(id){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"medidas/"+id+"/usuario",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}
async function saveMedidasCliente(medidas){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"medidas/save",{
        method:'POST',
        body:JSON.stringify(medidas),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
    })
    return result;
}
async function getRutinasDelCliente(id){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"usuario/rutina/"+id,{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}
async function saveRutinaCliente(rutina){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"usuario/rutina/save",{
        method:'POST',
        body:JSON.stringify(rutina),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
    })
    return result;
}


export {getMedidasCliente,saveMedidasCliente,getRutinasDelCliente,saveRutinaCliente}