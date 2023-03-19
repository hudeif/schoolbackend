const express = require("express");
const router = express.Router();
const syncDb = require("../config/syncDb");

router.get("/list", (req, res) => {
  let result = syncDb("select * from users");
  res.send(result);
});

router.post("/new", (req, res) => {
  const { userName, password, userType } = req.body;
  syncDb(
    `insert into users values(null,'${userName}','${password}','${userType}')`
  );
  res.send("created");
});

router.put("/update/:id", (req, res) => {
  const { userName, password, userType } = req.body;
  syncDb(`
  update 
    users 
  set 
    user_name = '${userName}',
    password = '${password}',
    user_type = '${userType}'
  where user_id = ${req.params.id}
  `);
  res.send("updated");
});

router.delete("/delete/:id", (req, res) => {
  syncDb(`delete from users where user_id=${req.params.id}`);
  res.send("deleted");
});

module.exports = router;
