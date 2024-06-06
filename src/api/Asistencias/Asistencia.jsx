import { urlBackend,makeRequest } from "../urlBackend";
async function datosAsitencias(){
    const result=await fetch(urlBackend+"asistencia/datos")
    return result;
}

async function asitenciaRegistrada() {
    const id = JSON.parse(localStorage.getItem("data")).id;
    return makeRequest(`asistencia/registrada/${id}`, 'GET');
}

async function saveAsitencia(asistencia) {
    return makeRequest("asistencia/save", 'POST', asistencia);
}
async function listaAsistencia(){
    
    const id = JSON.parse(localStorage.getItem("data")).id;
    return makeRequest("asistencia/cliente/"+id,'GET')
}

export {datosAsitencias,asitenciaRegistrada,saveAsitencia,listaAsistencia}