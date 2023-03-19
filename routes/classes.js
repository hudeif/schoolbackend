const express = require("express");
const router = express.Router();
const syncDb = require("../config/syncDb");

router.get("/list", (req, res) => {
  let result = syncDb(`SELECT * FROM classes
  LEFT JOIN shifts on classes.shift_id = shifts.shift_id`);
  res.send(result);
});

router.post("/new", (req, res) => {
  const { className, shiftId } = req.body;
  syncDb(`insert into classes values(null,'${className}',${shiftId})`);
  res.send("created");
});

router.put("/update/:id", (req, res) => {
  const { className, shiftId } = req.body;
  syncDb(
    `update 
        classes 
    set 
        class_name = '${className}',
        shift_id = ${shiftId} 
    where class_id=${req.params.id}`
  );
  res.send("updated");
});

router.delete("/delete/:id", (req, res) => {
  syncDb(`delete from classes where parent_id=${req.params.id}`);
  res.send("deleted");
});

module.exports = router;
