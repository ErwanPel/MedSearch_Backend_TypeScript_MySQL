import express, { Request, Response } from "express";
const { connection } = require("../db/config");

export const medRouter = express.Router();

type TDataGetAll = {
  id: number;
  name: string;
  quantity: number;
};

type TDataPost = {
  name: string;
  quantity: number;
};

medRouter.get("/medecine", (req: Request, res: Response) => {
  try {
    connection.query(
      "SELECT * FROM medecine",
      function (err: any, data: TDataGetAll) {
        if (err) console.log(err);
        else res.status(200).json(data);
      }
    );
  } catch (error) {
    res.status(500).json({ message: "an error occured in /medecine" });
  }
});

medRouter.post("/medecine", (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { name, quantity } = req.body;
    if (
      name &&
      typeof name === "string" &&
      quantity &&
      typeof quantity === "number"
    ) {
      connection.query(
        `INSERT INTO medecine (name, quantity) VALUES ('${name}', ${quantity});`,
        function (err: any, data: TDataPost) {
          if (err) {
            console.log(err);
            if ((err.code = "ER_DUP_ENTRY")) {
              res.status(400).json({
                message:
                  "this medecine is already in the database, you have to update the quantity with the button UPDATE",
              });
            }
          } else
            res.status(200).json({
              message: `le ${name} pour une quantité de ${quantity} a été ajouté !`,
            });
        }
      );
    } else {
      throw { status: 400, message: "missing name for medecine" };
    }
  } catch (error) {
    res.status(500).json({ message: "an error occured in /medecine" });
  }
});
