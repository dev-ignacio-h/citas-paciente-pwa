// Campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

class Citas {
  constructor() {
    this.citas = [];
  }

  agregarCitas(cita) {
    this.citas = [...this.citas, cita];
  }

  eliminarCita(id) {
    this.citas = this.citas.filter((cita) => cita.id !== id);
  }

  editarCitas(citaActualizada) {
    this.citas = this.citas.map((cita) =>
      cita.id === citaActualizada.id ? citaActualizada : cita
    );
  }
}

class UI {
  imprimirAlerta(mensaje, tipo) {
    // Crear div
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
    // Agregar clase en base al tipo de error
    if (tipo === 'error') {
      divMensaje.classList.add('alert-danger');
    } else {
      divMensaje.classList.add('alert-success');
    }
    // Mensaje de error
    divMensaje.textContent = mensaje;
    // Agregar al DOM
    document
      .querySelector('#contenido')
      .insertBefore(divMensaje, document.querySelector('.agregar-cita'));
    // Quitar la alerta después de 5 segundos
    setTimeout(() => {
      divMensaje.remove();
    }, 5000);
  }

  imprimirCitas({ citas }) {
    this.limpiarHTML();
    citas.forEach((cita) => {
      const {
        mascota,
        propietario,
        telefono,
        fecha,
        hora,
        sintomas,
        id
      } = cita;

      const divCita = document.createElement('div');
      divCita.classList.add('cita', 'p-3');
      divCita.dataset.id = id;

      // Scripting de los elementos de la cita
      const mascotaParrafo = document.createElement('h2');
      mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
      mascotaParrafo.textContent = mascota;

      const propietarioParrafo = document.createElement('p');
      propietarioParrafo.innerHTML = `
        <span class="font-weight-bolder">Propietario: </span> ${propietario}
       `;

      const telefonoParrafo = document.createElement('p');
      telefonoParrafo.innerHTML = `
        <span class="font-weight-bolder">Teléfono: </span>${telefono}
      `;

      const fechaParrafo = document.createElement('p');
      fechaParrafo.innerHTML = `
        <span class="font-weight-bolder">Fecha: </span>${fecha}
      `;

      const horaParrafo = document.createElement('p');
      horaParrafo.innerHTML = `
        <span class="font-weight-bolder">Hora: </span>${hora}
      `;

      const sintomasParrafo = document.createElement('p');
      sintomasParrafo.innerHTML = `
        <span class="font-weight-bolder">Síntomas: </span>${sintomas}
      `;

      // Botón para eliminar cita
      const btnEliminar = document.createElement('button');
      btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
      btnEliminar.innerHTML =
        'Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      btnEliminar.onclick = () => eliminarCita(id);

      // Botón para editar citas
      const btnEditar = document.createElement('button');
      btnEditar.classList.add('btn', 'btn-info');
      btnEditar.innerHTML =
        'Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
      btnEditar.onclick = () => cargarEdicion(cita);

      // Agregar los párrafos al div cita
      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);
      divCita.appendChild(btnEditar);

      // Agregar las citas al HTML
      contenedorCitas.appendChild(divCita);
    });
  }

  limpiarHTML() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }
}

const ui = new UI();
const administrarCitas = new Citas();

// Registrar eventos
eventListeners();
function eventListeners() {
  mascotaInput.addEventListener('input', datosCita);
  propietarioInput.addEventListener('input', datosCita);
  telefonoInput.addEventListener('input', datosCita);
  fechaInput.addEventListener('input', datosCita);
  horaInput.addEventListener('input', datosCita);
  sintomasInput.addEventListener('input', datosCita);

  formulario.addEventListener('submit', nuevaCita);
}

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
function datosCita(e) {
  citaObj[e.target.name] = e.target.value;
}

// valida y agrega una nueva cita a la clase de citas
function nuevaCita(e) {
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
    // Mensaje de agregado correctamente
    ui.imprimirAlerta('Se agregó correctamente');
  }

  // Reiniciar objeto para la validacion
  reiniciarObjeto();
  // Reiniciar formulario
  formulario.reset();
  // Mostrar el HTML de las citas
  ui.imprimirCitas(administrarCitas);
}

function reiniciarObjeto() {
  citaObj.mascota = '';
  citaObj.propietario = '';
  citaObj.telefono = '';
  citaObj.fecha = '';
  citaObj.hora = '';
  citaObj.sintomas = '';
}

function eliminarCita(id) {
  // Eliminar cita
  administrarCitas.eliminarCita(id);
  // Mostar mensaje
  ui.imprimirAlerta('La cita se eliminó correctamente');

  // Refrescar las citas
  ui.imprimirCitas(administrarCitas);
}

// Carga los datos y el modo edición
function cargarEdicion(cita) {
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
