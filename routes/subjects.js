const express = require("express");
const router = express.Router();
const syncDb = require("../config/syncDb");

router.get("/list", (req, res) => {
  let result = syncDb(`SELECT * FROM subjects`);
  res.send(result);
});

router.post("/new", (req, res) => {
  const { subjectName } = req.body;
  syncDb(`insert into subjects values(null,'${subjectName}')`);
  res.send("created");
});

router.put("/update/:id", (req, res) => {
  const { subjectName } = req.body;
  syncDb(
    `update 
        subjects 
    set 
        subject_name = '${subjectName}'
    where subject_id=${req.params.id}`
  );
  res.send("updated");
});

router.delete("/delete/:id", (req, res) => {
  let exists = syncDb(
    `select count(subject_id) as total from exam_results where subject_id=${req.params.id}`
  )[0].total;
  if (exists > 0) {
    return res.status(409).send("can not be deleted. it has related data");
  }
  syncDb(`delete from subjects where subject_id=${req.params.id}`);
  res.send("deleted");
});

module.exports = router;
