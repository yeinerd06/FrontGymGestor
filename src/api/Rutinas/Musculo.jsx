import { urlBackend } from "../urlBackend";

async function listaMusculo(){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"musculo",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}
async function saveMusculo(musculo){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"musculo/save",{
        method:'POST',
        body:JSON.stringify(musculo),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
    })
    return result;
}
export {listaMusculo,saveMusculo}