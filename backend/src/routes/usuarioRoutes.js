const express = require("express");

function setupRoutes(controller) {
  const router = express.Router();

  router.post("/usuarios", (req, res) => controller.insertarUsuario(req, res));
  router.get("/usuarios", (req, res) => controller.obtenerUsuarios(req, res));
  router.get("/exportar", (req, res) => controller.exportarUsuarios(req, res));
  router.post("/importar", (req, res) => controller.importarUsuarios(req, res));
  router.get("/health", (req, res) => controller.healthCheck(req, res));

  return router;
}

module.exports = setupRoutes;
