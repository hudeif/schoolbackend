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

router.post("/subjects/assign", (req, res) => {
  const { data, classId } = req.body;
  syncDb(`delete from teachers_classes where class_id = ${classId}`);

  data.forEach((item) => {
    const { teacherId, classId, subjectId } = item;
    syncDb(`INSERT INTO teachers_classes(teacher_id, class_id, subject_id) 
    VALUES(${teacherId},${classId},${subjectId})`);
  });

  res.send("saved successfully.");
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
  let exists = syncDb(
    `select count(class_id) as total from attendence where class_id=${req.params.id}`
  )[0].total;
  exists += syncDb(
    `select count(class_id) as total from exam_results where class_id=${req.params.id}`
  )[0].total;
  exists += syncDb(
    `select count(class_id) as total from students where class_id=${req.params.id}`
  )[0].total;
  if (exists > 0) {
    res.status(405).send("Can not be deleted it has related data");
  } else {
    syncDb(`delete from classes where class_id=${req.params.id}`);
    res.send("deleted");
  }
});

// get subjects of a class
router.get("/:id/subjects", (req, res) => {
  let result = syncDb(`
  SELECT tc.class_id classId,tc.teacher_id teacherId,tc.subject_id subjectId,s.subject_name,u.user_name FROM teachers_classes tc
LEFT JOIN subjects s on tc.subject_id = s.subject_id
LEFT JOIN users u on u.user_id = tc.teacher_id
WHERE tc.class_id = ${req.params.id}
  `);
  res.send(result);
});

module.exports = router;
