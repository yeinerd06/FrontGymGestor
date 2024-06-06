import { urlBackend } from "../urlBackend";

async function getCorporativo(){
    const result=await fetch(urlBackend+"corporativo",{
        method:'GET'
    })
    return result;
}

async function updateCorporativo(corporativo){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"corporativo/update",{
        method:'PUT',
        body:JSON.stringify(corporativo),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
    })
    return result;
}
async function downloadLogo(key){
    const result=await fetch(urlBackend+"corporativo/download/logo?key="+key,{
        method:'GET',
        
    })
    return result;
}
async function downloadHorario(key){
    const result=await fetch(urlBackend+"corporativo/download/horario?key="+key,{
        method:'GET',
        
    })
    return result;
}

async function saveLogo(file){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"corporativo/upload/logo",{
        method:'POST',
        body:file,
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;

}
async function saveHorario(file){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"corporativo/upload/horario",{
        method:'POST',
        body:file,
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;

}

async function saveImagenPublicidad(file){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"publicidad/upload",{
        method:'POST',
        body:file,
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;

}

async function downloadImagenPublicidad(key){
    const result=await fetch(urlBackend+"publicidad/download?key="+key,{
        method:'GET',
        
    })
    return result;
}
async function listaImagenPublicidad(){
    const result=await fetch(urlBackend+"publicidad",{
        method:'GET',
        
    })
    return result;
}
async function deleteImagenPublicidad(key){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"publicidad/delete/"+key,{
        method:'DELETE',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

export {getCorporativo,saveLogo,saveHorario,updateCorporativo,downloadLogo,downloadHorario, listaImagenPublicidad, downloadImagenPublicidad,saveImagenPublicidad,deleteImagenPublicidad}