import { urlBackend } from "../urlBackend";


async function updatePerfil(usuario){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"usuario/update/"+usuario.id,{
        method:'PUT',
        body:JSON.stringify(usuario),
        headers:{
            "Content-type":"application/json",
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

async function saveImagenPerfil(id,file){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"usuario/perfil/upload/"+id,{
        method:'POST',
        body:file,
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;

}

async function downloadImagenPerfil(id,key){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"usuario/download/"+id+"?key="+key,{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

export {downloadImagenPerfil ,saveImagenPerfil,updatePerfil}