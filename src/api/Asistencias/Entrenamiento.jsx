import { urlBackend,makeRequest } from "../urlBackend";


// async function asitenciaRegistrada() {
//     const id = JSON.parse(localStorage.getItem("data")).id;
//     return makeRequest(`asistencia/registrada/${id}`, 'GET');
// }

async function saveEntrenamiento(entrenamiento) {
    return makeRequest("entrenamiento/save", 'POST', entrenamiento);
}


export {saveEntrenamiento}