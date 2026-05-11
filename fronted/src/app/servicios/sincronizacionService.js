const UsuarioModel = require('../models/UsuarioModel');

class SincronizacionService {
  constructor(db, nodoId) {
    this.model = new UsuarioModel(db);
    this.nodoId = parseInt(nodoId);
    this.otrosNodos = this.getOtrosNodos();
    this.intervalo = null;
  }

  getOtrosNodos() {
    const todosLosNodos = [
      { id: 1, url: 'http://3.16.137.85:3001/api' },
      { id: 2, url: 'http://3.16.137.85:3002/api' },
      { id: 3, url: 'http://3.16.137.85:3003/api' },
    ];
    return todosLosNodos.filter((n) => n.id !== this.nodoId);
  }

  async sincronizarConNodo(nodo) {
    try {
      const ultimoId = await this.model.obtenerUltimoId();

      const response = await fetch(`${nodo.url}/exportar?desde_id=${ultimoId}`);

      if (!response.ok) return;

      const nuevos = await response.json();

      if (nuevos.length === 0) return;

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
          `✅ Nodo ${this.nodoId} sincronizó ${nuevos.length} registros del Nodo ${nodo.id}`,
        );
      }
    } catch (error) {
      console.log(`⚠️ Nodo ${nodo.id} no disponible, reintentando después...`);
    }
  }

  async sincronizarTodos() {
    for (const nodo of this.otrosNodos) {
      await this.sincronizarConNodo(nodo);
    }
  }

  iniciar(intervaloMs = 5000) {
    console.log(`🔄 Sincronización iniciada cada ${intervaloMs / 1000}s`);
    this.intervalo = setInterval(() => {
      this.sincronizarTodos();
    }, intervaloMs);

    // Primera sincronización inmediata
    this.sincronizarTodos();
  }

  detener() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      console.log('🛑 Sincronización detenida');
    }
  }
}

module.exports = SincronizacionService;
