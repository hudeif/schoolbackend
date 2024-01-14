const express = require("express");
const app = express();
const cors = require("cors");

const port = 5000;

app.use(express.json());
app.use(cors());
app.use("/parent", require("./routes/parent"));
app.use("/shift", require("./routes/shift"));
app.use("/academic-year", require("./routes/academicYear"));
app.use("/exam-type", require("./routes/examTypes"));
app.use("/user", require("./routes/users"));
app.use("/class", require("./routes/classes"));
app.use("/student", require("./routes/students"));
app.use("/teacher", require("./routes/teachers"));
app.use("/exam-result", require("./routes/examResult"));
app.use("/subject", require("./routes/subjects"));
app.use("/attendance", require("./routes/attendance"));
app.use("/expense", require("./routes/expense"));
app.use("/fee-type", require("./routes/feeType"));
app.use("/fee-transaction", require("./routes/feeTransaction"));
app.use("/payment", require("./routes/payment"));
app.use("/dashboard", require("./routes/dashboard"));

app.listen(port, (req, res) => {
  console.log("app running on port ", port);
});
