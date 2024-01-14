const express = require("express");
const router = express.Router();
const syncDb = require("../config/syncDb");

router.post("/all", (req, res) => {
  const { classId, month, year } = req.body;
  const result = syncDb(`
  SELECT ft.transaction_id,ft.date,f.fee_type_id,f.fee_type,ft.std_id,s.std_name,s.class_id,ft.debit FROM fee_transaction ft
LEFT JOIN students s on ft.std_id = s.std_id
LEFT JOIN fee_type f on f.fee_type_id = ft.fee_type
WHERE s.class_id = '${classId}' and month(ft.date) = '${month}' and year(ft.date) = '${year}' and ft.type = 'charged'
ORDER By ft.transaction_id`);
  res.send(result);
});

router.post("/fee-report", (req, res) => {
  const { classId, year } = req.body;
  const result = syncDb(`
  SELECT ft.std_id,s.std_name,sum(ft.debit) debit,sum(ft.credit) credit,sum(ft.debit) - sum(ft.credit) balance FROM fee_transaction ft
  LEFT JOIN students s on ft.std_id = s.std_id
  WHERE s.class_id = ${classId} and year(ft.date) = ${year}
  GROUP By ft.std_id
  UNION
  SELECT "Total","",sum(debit),sum(credit),sum(debit-credit) FROM fee_transaction
  LEFT JOIN students on fee_transaction.std_id = students.std_id
  WHERE students.class_id = ${classId}
  `);
  res.send(result);
});

router.post("/new", (req, res) => {
  const { date, feeTypeId, students, amount } = req.body;
  for (let i = 0; i < students.length; i++) {
    syncDb(`insert into fee_transaction 
      values(null,'${date}','','${students[i]}','','','${amount}','','charged','${feeTypeId}')`);
  }
  res.send("fee transaction created.");
});

router.delete("/delete/:id", (req, res) => {
  syncDb(`delete from fee_transaction where transaction_id=${req.params.id}`);
  res.send("transaction was deleted.");
});

router.post("/get-fee-total", (req, res) => {
  const { studentId } = req.body;
  const result =
    syncDb(`SELECT s.std_id,s.std_name,sum(ft.debit) total,sum(ft.credit) paid,sum(ft.debit - ft.credit) as balance FROM students s 
  LEFT JOIN fee_transaction ft on s.std_id = ft.std_id
  WHERE s.std_id = '${studentId}'
  `);

  if (!result[0].std_id) return res.status(404).send("student not found");
  res.send(result);
});

module.exports = router;
