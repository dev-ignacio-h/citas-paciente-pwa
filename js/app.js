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

class Citas {
  constructor() {
    this.citas = [];
  }

  agregarCitas(cita) {
    this.citas = [...this.citas, cita];
  }

  eliminarCita(id) {
    this.citas = this.citas.filter(cita => cita.id !== id)
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
      // Agregar los párrafos al div cita
      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);

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
  // generar un id unico
  citaObj.id = Date.now();
  // Creando una nueva cita
  administrarCitas.agregarCitas({ ...citaObj });
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
  administrarCitas.eliminarCita(id)
  // Mostar mensaje
  ui.imprimirAlerta('La cita se eliminó correctamente')

  // Refrescar las citas
  ui.imprimirCitas(administrarCitas);

}
