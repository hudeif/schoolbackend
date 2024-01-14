const express = require("express");
const router = express.Router();

const db = require("../config/Db");
const syncDb = require("../config/syncDb");

router.get("/summary", (req, res) => {
  const currentMonth = new Date().getMonth() + 1;

  const classes = syncDb("SELECT count(class_id) total FROM classes");
  const students = syncDb("SELECT count(std_id) total FROM students");
  const parents = syncDb("SELECT count(parent_id) total FROM parents");
  const teachers = syncDb("SELECT count(teacher_id) total FROM teachers");
  const users = syncDb("SELECT count(user_id) total FROM users");
  const fee = syncDb(`
  SELECT ifnull(SUM(debit),0) due, ifnull(SUM(credit),0) collected 
  FROM fee_transaction 
  WHERE month(date) = ${currentMonth}`);

  const expense = syncDb(
    `SELECT IFNULL(SUM(amount),0) expenses FROM expense WHERE month(date) = ${currentMonth}`
  );

  res.send({
    totalClasses: classes[0].total,
    totalStudents: students[0].total,
    totalParents: parents[0].total,
    totalTeachers: teachers[0].total,
    totalUsers: users[0].total,
    expense: expense[0].expenses,
    due: fee[0].due,
    collected: fee[0].collected,
  });
});

module.exports = router;
