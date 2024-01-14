const express = require("express");
const router = express.Router();
const syncDb = require("../config/syncDb");

router.post("/get-class-students", (req, res) => {
  const { classId, attendanceDate } = req.body;
  let result = syncDb(`SELECT s.std_id,s.std_name,a.status
  FROM students s
  LEFT JOIN attendence a
  ON s.std_id = a.student_id AND Date(a.date) = '${attendanceDate}'
  WHERE s.class_id = ${classId} `);
  res.send(result);
});

router.post("/new", (req, res) => {
  const { classId, attendanceDate, list } = req.body;

  list.forEach((item) => {
    const { std_id, status } = item;
    try {
      syncDb(
        `insert into attendence values(null,${classId},${std_id},${status},'${attendanceDate}')`
      );
    } catch (error) {
      res.status(500).send(error);
    }
  });
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

router.post("/delete", (req, res) => {
  const { classId, subjectId, attendanceDate } = req.body;
  try {
    syncDb(`delete from attendence where class_id=${classId}
         and Date(date) = '${attendanceDate}'`);

    res.send("deleted");
  } catch (err) {
    res.send(err);
  }
});

router.post("/class/monthly/report", (req, res) => {
  const { year, month, classId } = req.body;
  let result = syncDb(`
     SELECT c.date,st.std_id,st.std_name,cl.class_id,a.status FROM calendar c 
     CROSS JOIN students st 
     LEFT JOIN attendence a on st.std_id = a.student_id and c.date = a.date 
     LEFT JOIN classes cl on cl.class_id = st.class_id 
     WHERE month(c.date) = ${month} and c.year = ${year} and cl.class_id = ${classId} 
     ORDER BY c.date,st.std_id
  `);
  res.send(result);
});

router.post("/student/yearly/report", (req, res) => {
  const { year, month, classId } = req.body;
  let result = syncDb(`
  SELECT c.date,st.std_id,st.std_name,cl.class_id,monthname(c.date) as month,a.status FROM calendar c 
  CROSS JOIN students st 
  LEFT JOIN attendence a on st.std_id = a.student_id and c.date = a.date 
  LEFT JOIN classes cl on cl.class_id = st.class_id 
  WHERE c.year = 2023 and st.std_id = 154001
  ORDER BY c.date,st.std_id
  `);
  res.send(result);
});
module.exports = router;
