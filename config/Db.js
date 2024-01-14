const mysql = require("mysql2");

let conInfo = {
  database: "schooldb",
  host: "localhost",
  user: "root",
  password: "",
  port: 3306,
};

const db = mysql.createConnection(conInfo);

db.connect((err) => {
  if (err) throw err;
  console.log(`mysql db : ${db.config.database} has connected.`);
});

module.exports = db;
