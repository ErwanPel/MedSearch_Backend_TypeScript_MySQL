const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE,
});

connection.connect((err: any) => {
  if (err) throw err;
  console.log("Connecté à la base de donnée");
});

module.exports = { connection };
