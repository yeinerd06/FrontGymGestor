import { urlBackend } from "../urlBackend";

async function listaEquipamiento(){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"equipamiento",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

async function saveEquipamiento(equipameinto){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"equipamiento/save",{
        method:'POST',
        body:JSON.stringify(equipameinto),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
    })
    return result;
}

async function updateEquipamiento(equipameinto){
    let token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"equipamiento/update",{
        method:'PUT',
        body:JSON.stringify(equipameinto),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
    })
    return result
}

export {listaEquipamiento,saveEquipamiento,updateEquipamiento}