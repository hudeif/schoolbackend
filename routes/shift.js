const express = require("express");
const router = express.Router();
const syncDb = require("../config/syncDb");

router.get("/list", (req, res) => {
  let result = syncDb("select * from shifts");
  res.send(result);
});

router.post("/new", (req, res) => {
  const { shift } = req.body;
  syncDb(`insert into shifts values(null,'${shift}')`);
  res.send("created");
});

router.put("/update/:id", (req, res) => {
  const { shift } = req.body;
  syncDb(
    `update shifts set shift = '${shift}' where shift_id=${req.params.id}`
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
