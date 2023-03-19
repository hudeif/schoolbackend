const express = require("express");
const router = express.Router();
const syncDb = require("../config/syncDb");

router.get("/list", (req, res) => {
  let result = syncDb("select * from exam_types");
  res.send(result);
});

router.post("/new", (req, res) => {
  const { examType } = req.body;
  syncDb(`insert into exam_types values(null,'${examType}')`);
  res.send("created");
});

router.put("/update/:id", (req, res) => {
  const { examType } = req.body;
  syncDb(`update exam_types set exam_type = '${examType}'
   where exam_type_id = ${req.params.id}`);
  res.send("updated");
});

router.delete("/delete/:id", (req, res) => {
  syncDb(`delete from exam_types where exam_type_id=${req.params.id}`);
  res.send("deleted");
});

module.exports = router;
