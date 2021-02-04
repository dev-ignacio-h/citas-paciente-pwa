import { ui } from '../funciones.js'


export let DB;

export function crearDB() {
  // crear base de datos
  const crearDB = window.indexedDB.open('citas', 1);

  // si hay un error
  crearDB.onerror = function () {
    console.log('Hubo un error');
  };

  // si todo sale bien
  crearDB.onsuccess = function () {
    console.log('Base de datos creada');
    DB = crearDB.result;

    // mostrar citas al cargar (Pero indexed db ya está listo)
    ui.imprimirCitas();

  };

  // definir schema
  crearDB.onupgradeneeded = function (e) {
    const db = e.target.result;
    const objectStore = db.createObjectStore('citas', {
      keyPath: 'id',
      autoIncrement: true
    });

    // Definir todas las columnas
    objectStore.createIndex('mascota', 'mascota', { unique: false })
    objectStore.createIndex('propietario', 'propietario', { unique: false })
    objectStore.createIndex('telefono', 'telefono', { unique: false })
    objectStore.createIndex('fecha', 'fecha', { unique: false })
    objectStore.createIndex('hora', 'hora', { unique: false })
    objectStore.createIndex('sintomas', 'sintomas', { unique: false })
    objectStore.createIndex('id', 'id', { unique: false })

    console.log('DB creada y lista');
  };
}
