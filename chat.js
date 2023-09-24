const express = require("express");
const fs = require("fs");

const path = require("path");
const bodyParser = require("body-parser");

const app = express();

const Login = require("./routes/login");

const Msg = require("./routes/msg");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(Login);

app.use(Msg);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "pagenotfound.html"));
});

app.listen(8005, () => {
  console.log("Server is listening on port 8005");
});
