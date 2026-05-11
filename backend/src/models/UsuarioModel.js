class UsuarioModel {
  constructor(db) {
    this.db = db;
  }

  async crearTabla() {
    await this.db.run(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY,
                nombre TEXT NOT NULL,
                nodo_origen TEXT NOT NULL,
                timestamp INTEGER NOT NULL
            )
        `);
    await this.db.run(`
            CREATE TABLE IF NOT EXISTS eliminados (
                id INTEGER PRIMARY KEY,
                timestamp INTEGER NOT NULL
            )
        `);
  }

  async insertar(id, nombre, nodoOrigen, timestamp) {
    return this.db.run(
      `INSERT INTO usuarios (id, nombre, nodo_origen, timestamp) VALUES (?, ?, ?, ?)`,
      [id, nombre, nodoOrigen, timestamp],
    );
  }

  async obtenerTodos() {
    return this.db.all(`SELECT * FROM usuarios ORDER BY id`);
  }

  async obtenerUltimoId() {
    const result = await this.db.get(`SELECT MAX(id) as maxId FROM usuarios`);
    return result?.maxId || 0;
  }

  async obtenerPorIdMayor(minId) {
    return this.db.all(`SELECT * FROM usuarios WHERE id > ? ORDER BY id`, [
      minId,
    ]);
  }

  async insertarSiNoExiste(id, nombre, nodoOrigen, timestamp) {
    const eliminado = await this.db.get(
      `SELECT id FROM eliminados WHERE id = ?`,
      [id],
    );
    if (eliminado) return null;
    const existe = await this.db.get(`SELECT id FROM usuarios WHERE id = ?`, [
      id,
    ]);
    if (!existe) {
      return this.insertar(id, nombre, nodoOrigen, timestamp);
    }
    return null;
  }

  async actualizar(id, nombre) {
    return this.db.run(`UPDATE usuarios SET nombre = ? WHERE id = ?`, [
      nombre,
      id,
    ]);
  }

  async eliminar(id) {
    await this.db.run(
      `INSERT OR IGNORE INTO eliminados (id, timestamp) VALUES (?, ?)`,
      [id, Date.now()],
    );
    return this.db.run(`DELETE FROM usuarios WHERE id = ?`, [id]);
  }

  async obtenerEliminados() {
    return this.db.all(`SELECT * FROM eliminados`);
  }

  async registrarEliminado(id, timestamp) {
    await this.db.run(
      `INSERT OR IGNORE INTO eliminados (id, timestamp) VALUES (?, ?)`,
      [id, timestamp],
    );
    await this.db.run(`DELETE FROM usuarios WHERE id = ?`, [id]);
  }
}

module.exports = UsuarioModel;
