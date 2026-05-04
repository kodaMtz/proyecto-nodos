class IdGenerator {
  constructor(nodoId, incremento = 3) {
    this.nodoId = nodoId;
    this.incremento = incremento;
    this.startId = nodoId;
  }

  async getNextId(modelo) {
    const ultimoId = await modelo.obtenerUltimoId();

    if (ultimoId === 0) {
      return this.startId;
    }

    return ultimoId + this.incremento;
  }
}

module.exports = IdGenerator;
