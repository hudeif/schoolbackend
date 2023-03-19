const express = require("express");
const router = express.Router();
const syncDb = require("../config/syncDb");

router.get("/list", (req, res) => {
  let result = syncDb(`
  SELECT st.std_id,st.std_name,st.gender,st.phone,st.address,c.class_name,p.parent_name,st.reg_date FROM students st
LEFT JOIN classes c on st.class_id = c.class_id
LEFT JOIN parents p on st.parent_id = p.parent_id
  `);
  res.send(result);
});

router.get("/student-of-class/:classId", (req, res) => {
  let result = syncDb(
    `select * from students where class_id=${req.params.classId}`
  );
  res.send(result);
});

router.post("/new", (req, res) => {
  const { studentName, gender, phone, address, classId, parentId, regDate } =
    req.body;
  syncDb(`insert into students values(null,'${studentName}','${gender}'
  ,'${phone}','${address}',${classId},${parentId},'${regDate}')`);
  res.send("created");
});

router.put("/update/:id", (req, res) => {
  const { studentName, gender, phone, address, classId, parentId, regDate } =
    syncDb(
      `update 
        students 
    set 
        std_name = '${className}',
        gender = ${gender}, 
        phone = ${phone}, 
        address = ${address}, 
        class_id = ${classId}, 
        parent_id = ${parentId}, 
        reg_date = ${regDate} 
    where std_id=${req.params.id}`
    );
  res.send("updated");
});

router.delete("/delete/:id", (req, res) => {
  syncDb(`delete from students where std_id=${req.params.id}`);
  res.send("deleted");
});

module.exports = router;
