const express = require("express");
const path = require("path");
const mysql = require("mysql2"); // Add this line
const moment = require("moment");
const dotenv = require("dotenv");
const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`💬 server on port ${PORT}`));
dotenv.config();

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

// MySQL database configuration
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASS || "",
  database: process.env.DATABASE || "login_crud",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

let socketsConnected = new Set();

io.on("connection", onConnected);

function onConnected(socket) {
  console.log("Socket connected", socket.id);
  socketsConnected.add(socket.id);
  io.emit("clients-total", socketsConnected.size);

  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
    socketsConnected.delete(socket.id);
    io.emit("clients-total", socketsConnected.size);
  });

  socket.on("message", (data) => {
    // Store the message in the database
    storeMessageInDB(data);

    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
}
function storeMessageInDB(data) {
  const { name, message, dateTime } = data;

  const query = "INSERT INTO message (name, message, date) VALUES (?, ?, ?)";
  const values = [name, message, dateTime];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error storing message in database:", err);
    } else {
      console.log("Message stored in database");
    }
  });
}

function getUserIdByName(name) {
  // Assume you have a table 'users' with columns 'id' and 'name'
  const query = "SELECT id FROM users WHERE name = ? LIMIT 1";
  const values = [name];

  // Assuming you have a 'users' table with 'id' and 'name'
  let user_id = null;
  db.query(query, values, (err, results) => {
    if (!err && results.length > 0) {
      user_id = results[0].id;
    }
  });

  return user_id;
}
