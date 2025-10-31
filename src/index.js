// import { testDbConnection } from './db/connection.js';
// testDbConnection();

import express from "express";
import router from "./apis.js";
import { setupAuditTable } from "./db/setupAuditSystems.js";
import {connectRabbitMQ} from "./db/rabbitmq.js"
import { startWorker } from "./worker/auditWorker.js";
await setupAuditTable();

async function startServer() {
  // 1️⃣ Initialize Express app

  const app = express();
  app.use(express.json());

  await connectRabbitMQ()
  await startWorker()

  app.use("/", router);
  app.get("/", (req, res) => {
    res.send("Hello Node — Server is running fine ✅");
  });

  // Start server
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// 5️⃣ Run the startup process
startServer().catch((err) => console.error("Startup error:", err));
