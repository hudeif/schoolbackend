const express = require("express");
const router = express.Router();
const syncDb = require("../config/syncDb");

router.get("/list", (req, res) => {
  let result = syncDb("select * from parents");
  res.send(result);
});

router.post("/new", (req, res) => {
  const { parentName } = req.body;
  syncDb(`insert into parents values(null,'${parentName}')`);
  res.send("created");
});

router.put("/update/:id", (req, res) => {
  const { parentName } = req.body;
  syncDb(
    `update parents set parent_name = '${parentName}' where parent_id=${req.params.id}`
  );
  res.send("updated");
});

router.delete("/delete/:id", (req, res) => {
  syncDb(`delete from parents where parent_id=${req.params.id}`);
  res.send("deleted");
});

module.exports = router;
