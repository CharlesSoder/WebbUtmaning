// Har följt en socket tutorial och enligt socket.io instruktioner:
// Socket.io används för servern och gör det automatiskt för oss
// Nödvändiga funktioner
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Kopplar js sidan till html sidan (index.html)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

// Servern körs på 3000
server.listen(3000, () => {
  console.log("listening on: 3000");
});
