const express = require("express");
const cors = require("cors");
const Database = require("./config/database");
const UsuarioController = require("./controllers/usuarioController");
const setupRoutes = require("./routes/usuarioRoutes");
const SincronizacionService = require("./services/sincronizacionService");

const NODO_ID = process.env.NODO_ID || "1";
const MI_NOMBRE = process.env.MI_NOMBRE || "Nodo";
const PORT = process.env.PORT || 3000;

async function main() {
  const dbInstance = new Database(NODO_ID);
  await dbInstance.connect();
  const db = dbInstance.getDb();

  const controller = new UsuarioController(db, parseInt(NODO_ID), MI_NOMBRE);
  await controller.init();

  const sincronizacion = new SincronizacionService(db, NODO_ID);
  sincronizacion.iniciar(5000);

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api", setupRoutes(controller));

  app.listen(PORT, () => {
    console.log(`🤖 Nodo ${NODO_ID} - ${MI_NOMBRE} en puerto ${PORT}`);
    console.log(`🔄 Sincronizando con otros nodos cada 5 segundos`);
  });
}

main().catch(console.error);
