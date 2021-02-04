import Citas from './clases/Citas.js';
import UI from './clases/UI.js';
import { DB } from './db/indexedDB.js'

import {
  mascotaInput,
  propietarioInput,
  telefonoInput,
  fechaInput,
  horaInput,
  sintomasInput,
  formulario,
} from './selectores.js';

const administrarCitas = new Citas();
export const ui = new UI(administrarCitas);

let editando = false;

// Objeto con la información de la cita
const citaObj = {
  mascota: '',
  propietario: '',
  telefono: '',
  fecha: '',
  hora: '',
  sintomas: ''
};

// Agrega datos al objeto cita
export function datosCita(e) {
  citaObj[e.target.name] = e.target.value;
}

// valida y agrega una nueva cita a la clase de citas
export function nuevaCita(e) {
  e.preventDefault();
  // Extraer la info del obj de cita
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;
  //validar
  if (
    (mascota === '' ||
      propietario === '' ||
      telefono === '' ||
      fecha === '' ||
      hora === '',
    sintomas === '')
  ) {
    ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
    return;
  }

  if (editando) {
    console.log('modo edición');
    // Mensaje de editado correctamente
    ui.imprimirAlerta('Editado correctamente');
    // Pasar el objeto de la cita a edición
    administrarCitas.editarCitas({ ...citaObj });
    // Cambiar el texto del botón
    formulario.querySelector('button[type="submit"]').textContent =
      'Crear Cita';
    // Quitar modo edición
    editando = false;
  } else {
    // generar un id unico
    citaObj.id = Date.now();
    // Creando una nueva cita
    administrarCitas.agregarCitas({ ...citaObj });
    // Insertar Registro en IndexDB
    const transaction = DB.transaction(['citas'], 'readwrite');
    
    // Habilitar en object store
    const objectStore = transaction.objectStore('citas');
    
    // Insertar en la BD
    objectStore.add(citaObj);
    
    transaction.oncomplete = () => {
      console.log('cita agregada');
    }
    // Mensaje de agregado correctamente
    ui.imprimirAlerta('Se agregó correctamente');
  }

  // Mostrar el HTML de las citas
  ui.imprimirCitas();
  // Reiniciar objeto para la validacion
  reiniciarObjeto();
  // Reiniciar formulario
  formulario.reset();

}

export function reiniciarObjeto() {
  citaObj.mascota = '';
  citaObj.propietario = '';
  citaObj.telefono = '';
  citaObj.fecha = '';
  citaObj.hora = '';
  citaObj.sintomas = '';
}

export function eliminarCita(id) {
  // Eliminar cita
  administrarCitas.eliminarCita(id);
  // Mostar mensaje
  ui.imprimirAlerta('La cita se eliminó correctamente');

  // Refrescar las citas
  ui.imprimirCitas();
}

// Carga los datos y el modo edición
export function cargarEdicion(cita) {
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
  //Llenar los inputs
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  // Llenar objeto
  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  // Cambiar el texto del botón
  formulario.querySelector('button[type="submit"]').textContent =
    'Guardar Cambios';

  editando = true;
}


