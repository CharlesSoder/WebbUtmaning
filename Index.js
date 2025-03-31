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

let players = {}; // Sparar spelare som ansluter
let board = Array(9).fill(null); // Tre i rad spelyta
let currentTurn = "X"; // Börjar med att X alltid börjar spelet. Kommer ändra till varannan turn senare när spelet fungerar

//cmd visar "a user" connectar och disconnectar
io.on("connection", (socket) => {
  console.log("a user connected");
  // Tilldela X eller O
  if (!players.X) {
    //Här ska en funktion för att ge en player id = spelare X
  } else if (!players.O) {
    //Här ska en funktion för att ge en player id = spelare O
  } else {
    socket.emit("full", "Spelet är fullt!");
    return;
  }
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

//cmd visar msg
io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });
});

//cmd visar msg till alla
io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

io.emit("some event", {
  someProperty: "some value",
  otherProperty: "other value",
}); // This will emit the event to all connected sockets

io.on("connection", (socket) => {
  socket.broadcast.emit("hi");
});

// Servern körs på 3000 och i mitt fall: http://10.32.35.51:3000
server.listen(3000, "0.0.0.0", () => {
  console.log("Listening on: http://0.0.0.0:3000");
});
