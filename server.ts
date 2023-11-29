import express, { Application, Request, Response } from "express";
const { connection } = require("./src/db/config");
import { medRouter } from "./src/routes/medecine";
const app: Application = express();

app.use(express.json()).use(medRouter);

app.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "connect to MedSearch" });
  } catch (error) {
    res.status(500).json({ message: "no connected" });
  }
});

app.get("*", (req: Request, res: Response) => {
  try {
    res.status(400).json({ message: "page not found" });
  } catch (error) {
    res.status(500).json({ message: "no connected" });
  }
});

app.listen(3000, () => {
  console.log("connect to server !!!");
});
