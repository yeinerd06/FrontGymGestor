import { urlBackend } from "../urlBackend";

async function listaRutinas(){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"rutina",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}
async function saveRutina(rutina){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"rutina/save",{
        method:'POST',
        body:JSON.stringify(rutina),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
    })
    return result;
}
async function updateRutina(rutina){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"rutina/update",{
        method:'PUT',
        body:JSON.stringify(rutina),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
    })
    return result;
}
async function deleteRutina(id){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"rutina/delete/"+id,{
        method:'DELETE',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

export {listaRutinas,saveRutina,updateRutina,deleteRutina}