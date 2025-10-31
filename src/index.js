// src/index.js
import express from "express";
import { config } from "./config.js";
import auditRoutes from "./routes/auditRoutes.js";
import { setupAuditTable } from "./db/setupAuditSystems.js";
import { connectRabbitMQ } from "./db/rabbitmq.js";
import { startWorker } from "./worker/auditWorker.js";

async function startServer() {
  const app = express();
  app.use(express.json());

  await setupAuditTable();
  await connectRabbitMQ();
  await startWorker();

  app.use("/", auditRoutes);

  app.get("/", (req, res) => {
    res.send("✅ Audit Service is up and running!");
  });

  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => console.error("❌ Startup error:", err));
