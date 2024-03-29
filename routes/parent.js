const express = require("express");
const router = express.Router();
const syncDb = require("../config/syncDb");
const db = require("../config/Db");

router.get("/list", (req, res) => {
  let result = syncDb("select * from parents");
  res.send(result);
});

router.post("/new", (req, res) => {
  const { parentName } = req.body;
  // for creating user and password
  let userQuery = `insert into users values(null,'${
    parentName + Math.floor(Math.random() * 1000)
  }','1234','parent')`;
  //for creating the student

  db.query(userQuery, (err, result) => {
    if (err) return res.status(500).send("server error.");

    db.query(
      "SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1",
      (err, result) => {
        if (err) return res.status(500).send("server error.");
        let userId = result[0].user_id;

        let parentQry = `insert into parents values(null,'${parentName}','${userId}')`;

        db.query(parentQry, (err, result) => {
          if (err) return res.status(500).send("server error.");
          res.send("parent created");
        });
      }
    );
  });
});

router.put("/update/:id", (req, res) => {
  const { parentName } = req.body;
  syncDb(
    `update parents set parent_name = '${parentName}' where parent_id=${req.params.id}`
  );
  res.send("updated");
});

router.delete("/delete/:id", (req, res) => {
  let exists = syncDb(
    `select count(parent_id) as total from students where parent_id=${req.params.id}`
  )[0].total;
  if (exists > 0) {
    return res.status(409).send("can not be deleted. it has related data");
  }
  syncDb(`delete from parents where parent_id=${req.params.id}`);
  res.send("deleted");
});

module.exports = router;
