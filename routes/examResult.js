const express = require("express");
const router = express.Router();
const syncDb = require("../config/syncDb");

router.get("/list", (req, res) => {
  let result = syncDb(`
  SELECT rs.result_id,et.exam_type_id, et.exam_type,ay.academic_year_id,ay.academic_year,s.std_id,s.std_name,c.class_id,c.class_name,sbj.subject_id,sbj.subject_name,rs.mark,Date(rs.rs_date) rs_date FROM exam_results rs
LEFT JOIN exam_types et on rs.exam_type_id = et.exam_type_id
LEFT JOIN classes c on rs.class_id = c.class_id
LEFT JOIN students s on rs.std_id = s.std_id
LEFT JOIN subjects sbj on rs.subject_id = sbj.subject_id
LEFT JOIN academic_year ay on rs.academic_year_id = ay.academic_year_id
  `);
  res.send(result);
});

router.post("/filter", (req, res) => {
  const { examTypeId, academicYearId, classId, studentId } = req.body;
  let examid = "";
  let academicid = "";
  let classid = "";
  let studentid = "";
  if (examTypeId !== "") {
    examid = `rs.exam_type_id ='${examTypeId}'`;
  }

  if (academicYearId !== "") {
    if (examid !== "") academicid += "and ";
    academicid += `rs.academic_year_id = '${academicYearId}'`;
  }
  if (classId !== "") {
    if (academicYearId !== "" || examid !== "") classid += "and ";
    classid += `rs.class_id='${classId}'`;
  }
  if (studentId !== "") {
    if (classid !== "" || academicYearId !== "" || examid !== "")
      studentid += "and ";
    studentid += `rs.std_id = '${studentId}'`;
  }

  let result = syncDb(`
  SELECT rs.result_id,et.exam_type_id, et.exam_type,ay.academic_year_id,ay.academic_year,s.std_id,s.std_name,c.class_id,c.class_name,rs.mark,Date(rs.rs_date) rs_date FROM exam_results rs
  LEFT JOIN exam_types et on rs.exam_type_id = et.exam_type_id
  LEFT JOIN classes c on rs.class_id = c.class_id
  LEFT JOIN students s on rs.std_id = s.std_id
  LEFT JOIN academic_year ay on rs.academic_year_id = ay.academic_year_id
  where ${examid} 
   ${academicid === "" ? "" : academicid} 
   ${classid === "" ? "" : classid} 
   ${studentid === "" ? "" : studentid}
  `);
  res.send(result);
});

router.post("/new", (req, res) => {
  const {
    examTypeId,
    academicYearId,
    studentId,
    classId,
    subjectId,
    mark,
    resultDate,
  } = req.body;
  syncDb(`insert into exam_results values(null,'${examTypeId}',${academicYearId}
  ,${studentId},${classId},${subjectId},"${mark}","${resultDate}")`);
  res.send("created");
});

router.put("/update/:id", (req, res) => {
  const {
    examTypeId,
    academicYearId,
    studentId,
    subjectId,
    classId,
    mark,
    resultDate,
  } = req.body;
  syncDb(
    `update 
        exam_results 
    set 
        exam_type_id = ${examTypeId},
        academic_year_id = ${academicYearId}, 
        std_id = ${studentId},
        class_id = ${classId},
        subject_id = ${subjectId}, 
        mark = ${mark}, 
        rs_date = '${resultDate}' 
    where result_id=${req.params.id}`
  );
  res.send("updated");
});

router.delete("/delete/:id", (req, res) => {
  syncDb(`delete from exam_results where result_id=${req.params.id}`);
  res.send("deleted");
});

function subjecst() {
  const result = syncDb(`select * from subjects`);
  let html = "";

  result.forEach((sub) => {
    html += `max(case when ca.subject_name = '${sub.subject_name}' then coalesce(ca.mark, '') end) as ${sub.subject_name},`;
  });

  html += `sum(ca.mark) as total`;

  return html;
}

router.post("/report", (req, res) => {
  const { academicYearId, classId, examTypeId } = req.body;
  let result = syncDb(`
  SELECT 
ca.std_id id,
ca.std_name student,
${subjecst()}
FROM
(
SELECT s.std_id,s.std_name,s.class_id,sbj.subject_name,er.mark,er.exam_type_id,er.academic_year_id FROM students s 
LEFT JOIN exam_results er on s.std_id = er.std_id
LEFT JOIN subjects sbj on er.subject_id = sbj.subject_id
) ca WHERE ifnull(academic_year_id,${academicYearId})=${academicYearId} and ca.class_id = ${classId} and ifnull(exam_type_id,${examTypeId})=${examTypeId}
GROUP BY ca.std_id
  `);
  res.send(result);
});

module.exports = router;
