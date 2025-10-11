import Sequelize from "sequelize";
import pg from "pg";

import getUserModel from "./User.js";
import getMessageModel from "./Message.js";
import getTarefaModel from "./Tarefa.js";

// Prefer DATABASE_URL (common in managed DB providers like Neon)
const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  protocol: "postgres",
  // logging: false, // Disable SQL query logging
  dialectOptions: {
    // Necessary for SSL on NeonDB, Render.com and other providers
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  dialectModule: pg,
});

const models = {
  User: getUserModel(sequelize, Sequelize),
  Message: getMessageModel(sequelize, Sequelize),
  Tarefa: getTarefaModel(sequelize, Sequelize),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
