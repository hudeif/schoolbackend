const express = require("express");
const router = express.Router();
const syncDb = require("../config/syncDb");
const db = require("../config/Db");

router.get("/list", (req, res) => {
  let result = syncDb(`
  SELECT st.std_id,st.std_name,st.gender,st.phone,st.address,c.class_id,c.class_name,p.parent_id,p.parent_name,st.reg_date FROM students st
LEFT JOIN classes c on st.class_id = c.class_id
LEFT JOIN parents p on st.parent_id = p.parent_id
  `);
  res.send(result);
});

router.get("/:id", (req, res) => {
  let result = syncDb(`
  SELECT st.std_id,st.std_name,st.gender,st.phone,st.address,c.class_id,c.class_name,p.parent_id,p.parent_name,st.reg_date FROM students st
LEFT JOIN classes c on st.class_id = c.class_id
LEFT JOIN parents p on st.parent_id = p.parent_id
where st.std_id = ${req.params.id}
  `);
  res.send(result[0]);
});

router.get("/student-of-class/:classId", (req, res) => {
  let result = syncDb(
    `select * from students where class_id=${req.params.classId}`
  );
  res.send(result);
});

router.get("/statement/:id", (req, res) => {
  syncDb("set @total=0;");
  const result = syncDb(`
  SELECT ft.transaction_id,ft.std_id,Date(ft.date) date,ft.type,ft.debit,ft.credit,
  if(ft.type='charged',@total:= @total+ft.debit,@total:=@total-ft.credit) as balance FROM fee_transaction ft 
  WHERE ft.std_id = ${req.params.id}
  UNION
  SELECT "total","","","",SUM(debit),SUM(credit),SUM(debit-credit) FROM fee_transaction
  WHERE fee_transaction.std_id = ${req.params.id}
  `);
  res.send(result);
});

router.get("/exams/:id", (req, res) => {
  const result = syncDb(`
  SELECT et.exam_type_id,et.exam_type,sbj.subject_name,s.std_id,er.mark,er.rs_date FROM exam_types et
CROSS JOIN subjects sbj
CROSS JOIN students s
LEFT JOIN exam_results er on et.exam_type_id = er.exam_type_id and er.subject_id = sbj.subject_id and s.std_id = er.std_id
WHERE s.std_id = ${req.params.id}
  `);
  res.send(result);
});

router.post("/new", (req, res) => {
  const { studentName, gender, phone, address, classId, parentId, regDate } =
    req.body;

  // for creating user and password
  let userQuery = `insert into users values(null,'${
    studentName + phone
  }','1234','student')`;
  //for creating the student

  db.query(userQuery, (err, result) => {
    if (err) return res.status(500).send("server error.");

    db.query(
      "SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1",
      (err, result) => {
        if (err) return res.status(500).send("server error.");
        let userId = result[0].user_id;

        let studentQuery = `insert into students values(null,'${userId}','${studentName}','${gender}'
      ,'${phone}','${address}',${classId},${parentId},'${regDate}')`;

        db.query(studentQuery, (err, result) => {
          if (err) return res.status(500).send("server error.");
          res.send("student created");
        });
      }
    );
  });
});

router.put("/update/:id", (req, res) => {
  const { studentName, gender, phone, address, classId, parentId, regDate } =
    req.body;
  syncDb(
    `update 
        students 
    set 
        std_name = '${studentName}',
        gender = '${gender}', 
        phone = '${phone}', 
        address = '${address}', 
        class_id = ${classId}, 
        parent_id = ${parentId}, 
        reg_date = '${regDate}' 
    where std_id=${req.params.id}`
  );
  res.send("updated");
});

router.delete("/delete/:id", (req, res) => {
  let exists = syncDb(
    `select count(std_id) as total from exam_results where std_id=${req.params.id}`
  )[0].total;
  exists += syncDb(
    `select count(student_id) as total from attendence where student_id=${req.params.id}`
  )[0].total;
  if (exists > 0) {
    return res.status(409).send("can not be deleted. it has related data");
  }
  syncDb(`delete from students where std_id=${req.params.id}`);
  res.send("deleted");
});

module.exports = router;
