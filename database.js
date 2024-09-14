const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "my2706",
  database: "commercial_menager",
  connectTimeout: false,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
    return;
  }
  console.log("CONNECTED");

  connection.release();
});

module.exports = pool;
