const fetch = require("node-fetch");
const UsuarioModel = require("../models/UsuarioModel");

class SincronizacionService {
  constructor(db, nodoId) {
    this.model = new UsuarioModel(db);
    this.nodoId = parseInt(nodoId);
    this.otrosNodos = this.getOtrosNodos();
    this.intervalo = null;
  }

  getOtrosNodos() {
    const todosLosNodos = [
      { id: 1, url: "http://3.16.137.85:3001/api" },
      { id: 2, url: "http://3.16.137.85:3002/api" },
      { id: 3, url: "http://3.16.137.85:3003/api" },
    ];
    return todosLosNodos.filter((n) => n.id !== this.nodoId);
  }

  async sincronizarConNodo(nodo) {
    try {
      const ultimoId = await this.model.obtenerUltimoId();
      const responseNuevos = await fetch(
        `${nodo.url}/exportar?desde_id=${ultimoId}`,
      );
      if (responseNuevos.ok) {
        const nuevos = await responseNuevos.json();
        for (const usuario of nuevos) {
          await this.model.insertarSiNoExiste(
            usuario.id,
            usuario.nombre,
            usuario.nodo_origen,
            usuario.timestamp,
          );
        }
        if (nuevos.length > 0) {
          console.log(
            `Nodo ${this.nodoId} sincronizo ${nuevos.length} registros del Nodo ${nodo.id}`,
          );
        }
      }

      const responseEliminados = await fetch(`${nodo.url}/exportar-eliminados`);
      if (responseEliminados.ok) {
        const eliminados = await responseEliminados.json();
        for (const eliminado of eliminados) {
          await this.model.registrarEliminado(
            eliminado.id,
            eliminado.timestamp,
          );
        }
        if (eliminados.length > 0) {
          console.log(
            `Nodo ${this.nodoId} sincronizo ${eliminados.length} eliminaciones del Nodo ${nodo.id}`,
          );
        }
      }
    } catch (error) {
      console.log(`Nodo ${nodo.id} no disponible, reintentando despues...`);
    }
  }

  async sincronizarTodos() {
    for (const nodo of this.otrosNodos) {
      await this.sincronizarConNodo(nodo);
    }
  }

  iniciar(intervaloMs = 5000) {
    console.log(`Sincronizacion iniciada cada ${intervaloMs / 1000}s`);
    this.intervalo = setInterval(() => {
      this.sincronizarTodos();
    }, intervaloMs);
    this.sincronizarTodos();
  }

  detener() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }
}

module.exports = SincronizacionService;
