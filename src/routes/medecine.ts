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

type TDataPutQuantity = {
  id: number;
  quantity: number;
};

medRouter.get("/medecine", (req: Request, res: Response) => {
  try {
    if (req.query.search) {
      connection.query(
        ` SELECT UPPER(medecine.name) AS medecine, family_med.family, medecine.quantity, supply.name as supply FROM medecine_supply LEFT JOIN medecine ON medecine.id = medecine_supply.medecine_id JOIN supply ON supply.id = medecine_supply.supply_id JOIN family_med ON family_med.id = medecine.family_id WHERE medecine.name LIKE "%${req.query.search}%" ORDER BY medecine.name ASC`,
        function (err: any, data: TDataGetAll) {
          if (err) console.log(err);
          else res.status(200).json(data);
        }
      );
    } else {
      connection.query(
        "SELECT UPPER(medecine.name) AS medecine, family_med.family, medecine.quantity, supply.name as supply FROM medecine_supply LEFT JOIN medecine ON medecine.id = medecine_supply.medecine_id JOIN supply ON supply.id = medecine_supply.supply_id JOIN family_med ON family_med.id = medecine.family_id ORDER BY medecine.name ASC",
        function (err: any, data: TDataGetAll) {
          if (err) console.log(err);
          else res.status(200).json(data);
        }
      );
    }
  } catch (error) {
    res.status(500).json({ message: "an error occured in /medecine" });
  }
});

medRouter.post("/medecine", (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { name, quantity, family_id } = req.body;
    if (
      name &&
      typeof name === "string" &&
      quantity &&
      typeof quantity === "number" &&
      family_id &&
      typeof family_id === "number"
    ) {
      connection.query(
        `INSERT INTO medecine (name, quantity, family_id) VALUES ('${name}', ${quantity}, ${family_id});`,
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

medRouter.put("/medecine/quantity/add", (req: Request, res: Response) => {
  const { id, quantity } = req.body;
  try {
    if (id && quantity) {
      connection.query(
        `UPDATE medecine SET quantity = quantity + ${quantity} WHERE id = ${id}`,
        function (err: any, data: TDataPutQuantity) {
          if (err) {
            console.log(err);
          } else
            res.status(200).json({
              message: `quantité ajouté`,
            });
        }
      );
    } else {
      throw { status: 400, message: "missing quantity or id for medecine" };
    }
  } catch (error) {
    res.status(500).json({ message: "an error occured in /medecine" });
  }
});

medRouter.put("/medecine/quantity/remove", (req: Request, res: Response) => {
  const { id, quantity } = req.body;
  try {
    if (id && quantity) {
      connection.query(
        `UPDATE medecine SET quantity = quantity - ${quantity} WHERE id = ${id}`,
        function (err: any, data: TDataPutQuantity) {
          if (err) {
            console.log(err);
          } else
            res.status(200).json({
              message: `quantité supprimé`,
            });
        }
      );
    } else {
      throw { status: 400, message: "missing quantity or id for medecine" };
    }
  } catch (error) {
    res.status(500).json({ message: "an error occured in /medecine" });
  }
});
