import { urlBackend } from "../urlBackend";

async function sendEmailComprobante(id){

    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"mail/comprobante/"+id,{
        method:'POST',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result

}
async function downloadPdfComprobante(id){

    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"usuario/membresia/comprobante/"+id,{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result

}



export {sendEmailComprobante,downloadPdfComprobante}