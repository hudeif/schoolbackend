const Mysql = require("sync-mysql");

let conInfo = {
  database: "schooldb",
  host: "localhost",
  user: "root",
  password: "",
  port: 3306,
};

const conn = new Mysql(conInfo);

if (conn) {
  console.log("db connected");
} else {
  console.log("something happer");
}

module.exports = function syncDb(query) {
  return conn.query(query);
};
