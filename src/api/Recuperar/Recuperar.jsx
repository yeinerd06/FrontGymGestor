import { urlBackend ,makeRequest} from "../urlBackend";

async function enviarEmail(email){
   //return makeRequest(`mail/recuperar/${email}`,'GET')
   const result=await fetch(urlBackend+"mail/recuperar/"+email)
   return result;
   
}
async function validarCodigo(email,codigo){
   
    const result=await fetch(urlBackend+"codigo/recuperar/email/"+email,{
        method:'POST',
        body:JSON.stringify(codigo),
        headers:{
            "Content-type":"application/json"
        }
    })
    return result;
    
 }
 async function updatePassword(id,usuario){
   
    const result=await fetch(urlBackend+"codigo/recuperar/codigo/"+id,{
        method:'POST',
        body:JSON.stringify(usuario),
        headers:{
            "Content-type":"application/json"
        }
    })
    return result;
    
 }


export {enviarEmail,validarCodigo,updatePassword}