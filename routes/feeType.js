const express = require("express");
const router = express.Router();
const syncDb = require("../config/syncDb");

router.get("/all", (req, res) => {
  const result = syncDb(`select * from fee_type`);
  res.send(result);
});

router.post("/new", (req, res) => {
  const { feeType } = req.body;
  syncDb(`insert into fee_type values(null,'${feeType}')`);
  res.send("fee type created.");
});

router.put("/update/:id", (req, res) => {
  const { feeType } = req.body;
  syncDb(
    `update fee_type set fee_type='${feeType}' where fee_type_id=${req.params.id}`
  );
  res.send("fee type updated.");
});

router.delete("/delete/:id", (req, res) => {
  syncDb(`delete from fee_type where fee_type_id=${req.params.id}`);
  res.send("fee type deleted.");
});

module.exports = router;
