const express = require("express");
const router = express.Router();
const syncDb = require("../config/syncDb");

router.get("/list", (req, res) => {
  let result = syncDb("select * from academic_year");
  res.send(result);
});

router.post("/new", (req, res) => {
  const { academicYear } = req.body;
  syncDb(`insert into academic_year values(null,'${academicYear}')`);
  res.send("created");
});

router.put("/update/:id", (req, res) => {
  const { academicYear } = req.body;
  syncDb(`update academic_year set academic_year = '${academicYear}'
   where academic_year_id = ${req.params.id}`);
  res.send("updated");
});

router.delete("/delete/:id", (req, res) => {
  let exists = syncDb(
    `select count(academic_year_id) as total from exam_results where academic_year_id=${req.params.id}`
  )[0].total;
  if (exists > 0) {
    return res.status(409).send("can not be deleted. it has related data");
  }
  syncDb(`delete from academic_year where academic_year_id=${req.params.id}`);
  res.send("deleted");
});

module.exports = router;
