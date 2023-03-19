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
app.use("/exam-result", require("./routes/examResult"));

app.listen(port, (req, res) => {
  console.log("app running on port ", port);
});
