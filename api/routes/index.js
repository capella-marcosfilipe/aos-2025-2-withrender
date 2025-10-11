import { Router } from "express";
import user from "./user.js";
import message from "./message.js";
import tarefa from "./tarefa.js";

// Minimal root router so the API root responds with a small health object
const root = Router();
root.get("/", (req, res) => res.status(200).json({ status: "ok" }));

export default {
  root,
  user,
  message,
  tarefa,
};
