const express = require("express");
const config = require("../config");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

const app = express();
const PORT = config.SERVER_PORT;

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Connect database
const connectionString = config.database.CONNECTIONSTRING;
mongoose.connect(connectionString);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
