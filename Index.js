// Har följt en socket tutorial och enligt socket.io instruktioner:
// Nödvändiga funktioner
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

// Kopplar js sidan till html sidan (index.html)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

// Servern körs på 3000
server.listen(3000, () => {
  console.log("listening on: 3000");
});
