const express = require("express");
const router = express.Router();
const syncDb = require("../config/syncDb");

router.get("/all", (req, res) => {
  const result =
    syncDb(`select ft.transaction_id,date(ft.date) date,s.std_name,c.class_name,ft.credit from fee_transaction ft
    left join students s on s.std_id = ft.std_id
    left join classes c on s.class_id = c.class_id
  where type='payment'`);
  res.send(result);
});

router.post("/new", (req, res) => {
  const { date, studentId, amount } = req.body;
  syncDb(`insert into fee_transaction 
      values(null,'${date}','','${studentId}','','','','${amount}','payment','${4}')`);
  res.send("payment created.");
});

module.exports = router;
