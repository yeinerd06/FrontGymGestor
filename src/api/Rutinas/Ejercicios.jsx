import { urlBackend } from "../urlBackend";

async function listaEjercicios(){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"ejercicio",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

async function saveEjercicio(ejercicio){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"ejercicio/save",{
        method:'POST',
        body:JSON.stringify(ejercicio),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
    })
    return result;
}
async function updateEjercicio(ejercicio){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"ejercicio/update",{
        method:'PUT',
        body:JSON.stringify(ejercicio),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
    })
    return result;
}

export {listaEjercicios,saveEjercicio,updateEjercicio}