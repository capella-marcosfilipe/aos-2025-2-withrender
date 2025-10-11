import "dotenv/config";
import cors from "cors";
import express from "express";

import models, { sequelize } from "./models/index.js";
import routes from "./routes/index.js";

// ---------------------
// App and basic config
// ---------------------
const app = express();
app.set("trust proxy", true);

const port = process.env.PORT ?? 3000;

// CORS configuration (allows any origin and an example origin)
const corsOptions = {
  origin: ["http://example.com", "*"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// ---------------------
// Middleware
// ---------------------
// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inject models into request context for handlers
app.use(async (req, res, next) => {
  req.context = { models };
  next();
});

// ---------------------
// Routes
// ---------------------
app.use("/", routes.root);
app.use("/users", routes.user);
app.use("/messages", routes.message);
app.use("/tarefas", routes.tarefa);

// ---------------------
// Database initialization & server start
// ---------------------
const eraseDatabaseOnSync = process.env.ERASE_DATABASE === "true";

// Sync DB on cold start and expose an init promise that handlers can await.
const initPromise = sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    await createUsersWithMessages();
  }
});

// If we're running locally (not on Vercel), start an HTTP server so
// `npm start`/`node local-server.js` can be used for development.
// Vercel sets the VERCEL env var in its runtime, so skip listen there.
if (!process.env.VERCEL) {
  initPromise.then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}!`);
    });
  });
}

// For serverless platforms (Vercel), export a handler that waits for DB init
// and then forwards the incoming request to the Express app.
export default async function handler(req, res) {
  await initPromise;
  return app(req, res);
}

// ---------------------
// Helper: seed data (used when ERASE_DATABASE=true)
// ---------------------
const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: "rwieruch",
      email: "rwieruch@email.com",
      password: "password123",
      messages: [
        { text: "Published the Road to learn React" },
        { text: "Published also the Road to learn Express + PostgreSQL" },
      ],
    },
    { include: [models.Message] }
  );

  await models.User.create(
    {
      username: "ddavids",
      email: "ddavids@email.com",
      password: "password123",
      messages: [
        { text: "Happy to release ..." },
        { text: "Published a complete ..." },
      ],
    },
    { include: [models.Message] }
  );
};
