const IdGenerator = require("../utils/idGenerator");
const UsuarioModel = require("../models/UsuarioModel");

class UsuarioController {
  constructor(db, nodoId, miNombre) {
    this.model = new UsuarioModel(db);
    this.idGenerator = new IdGenerator(nodoId);
    this.miNombre = miNombre;
    this.nodoId = nodoId;
  }

  async init() {
    await this.model.crearTabla();
  }

  async insertarUsuario(req, res) {
    const { nombre } = req.body;
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: "Nombre requerido" });
    }
    try {
      const nextId = await this.idGenerator.getNextId(this.model);
      const timestamp = Date.now();
      await this.model.insertar(
        nextId,
        nombre.trim(),
        this.miNombre,
        timestamp,
      );
      res.status(201).json({
        id: nextId,
        nombre: nombre.trim(),
        nodo_origen: this.miNombre,
        timestamp,
      });
    } catch (error) {
      res.status(500).json({ error: "Error al insertar" });
    }
  }

  async obtenerUsuarios(req, res) {
    try {
      const usuarios = await this.model.obtenerTodos();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener" });
    }
  }

  async actualizarUsuario(req, res) {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: "Nombre requerido" });
    }
    try {
      const result = await this.model.actualizar(parseInt(id), nombre.trim());
      if (result.changes === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json({ id: parseInt(id), nombre: nombre.trim(), actualizado: true });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar" });
    }
  }

  async eliminarUsuario(req, res) {
    const { id } = req.params;
    try {
      const result = await this.model.eliminar(parseInt(id));
      if (result.changes === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json({ id: parseInt(id), eliminado: true });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar" });
    }
  }

  async exportarUsuarios(req, res) {
    const desdeId = parseInt(req.query.desde_id) || 0;
    const usuarios = await this.model.obtenerPorIdMayor(desdeId);
    res.json(usuarios);
  }

  async exportarEliminados(req, res) {
    try {
      const eliminados = await this.model.obtenerEliminados();
      res.json(eliminados);
    } catch (error) {
      res.status(500).json({ error: "Error al exportar eliminados" });
    }
  }

  async importarUsuarios(req, res) {
    const nuevos = req.body;
    let insertados = 0;
    for (const usuario of nuevos) {
      const result = await this.model.insertarSiNoExiste(
        usuario.id,
        usuario.nombre,
        usuario.nodo_origen,
        usuario.timestamp,
      );
      if (result) insertados++;
    }
    res.json({ recibidos: nuevos.length, insertados });
  }

  async healthCheck(req, res) {
    res.json({ nodo: this.nodoId, nombre: this.miNombre, status: "online" });
  }
}

module.exports = UsuarioController;
