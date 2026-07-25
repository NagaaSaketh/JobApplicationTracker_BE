const { initialiseDB } = require("./db/db.connect");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");

app.use("/", authRouter);
app.use("/", jobRouter);

initialiseDB();

app.get("/", (req, res) => {
  res.send("Job-Tracker Backend");
});

const PORT = 3000;

app.listen(PORT, () =>
  console.log("Server is running on", PORT || process.env.PORT),
);
