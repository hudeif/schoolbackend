const express = require("express");
const router = express.Router();
const syncDb = require("../config/syncDb");

router.get("/list", (req, res) => {
  let result = syncDb("select * from expense");
  res.send(result);
});

router.post("/new", (req, res) => {
  const { expenseName, amount } = req.body;
  syncDb(`insert into expense values(null,'${expenseName}','${amount}',now())`);
  res.send("created");
});

router.put("/update/:id", (req, res) => {
  const { expenseName, amount } = req.body;
  syncDb(
    `update expense set 
        expense_name = '${expenseName}',
        amount = '${amount}'
    where expense_id=${req.params.id}`
  );
  res.send("updated");
});

router.delete("/delete/:id", (req, res) => {
  syncDb(`delete from expense where expense_id=${req.params.id}`);
  res.send("deleted");
});

module.exports = router;
