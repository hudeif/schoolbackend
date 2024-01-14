const express = require("express");
const router = express.Router();
const syncDb = require("../config/syncDb");
const db = require("../config/Db");

router.get("/list", (req, res) => {
  let result = syncDb("select * from teachers");
  res.send(result);
});

router.post("/new", (req, res) => {
  const { teacherName, phone } = req.body;
  // for creating user and password
  let userQuery = `insert into users values(null,'${
    teacherName + Math.floor(Math.random() * 1000)
  }','1234','teacher')`;
  //for creating the teacher

  db.query(userQuery, (err, result) => {
    if (err) return res.status(500).send("server error.");

    db.query(
      "SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1",
      (err, result) => {
        if (err) return res.status(500).send("server error.");
        let userId = result[0].user_id;

        let teacherQry = `insert into teachers values(null,'${teacherName}','${phone}','${userId}')`;

        db.query(teacherQry, (err, result) => {
          if (err) return res.status(500).send("server error.");
          res.send("teacher created");
        });
      }
    );
  });
});

router.put("/update/:id", (req, res) => {
  const { teacherName, phone } = req.body;
  syncDb(
    `update teachers 
        set 
    teacher_name = '${teacherName}', 
    teacher_phone = '${phone}' 
    where teacher_id=${req.params.id}`
  );
  res.send("updated");
});

router.delete("/delete/:id", (req, res) => {
  let exists = syncDb(
    `select count(shift_id) as total from classes where shift_id=${req.params.id}`
  )[0].total;
  if (exists > 0) {
    return res.status(409).send("can not be deleted. it has related data");
  }
  syncDb(`delete from shifts where shift_id=${req.params.id}`);
  res.send("deleted");
});

module.exports = router;
