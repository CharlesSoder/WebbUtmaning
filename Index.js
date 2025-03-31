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

io.on("connection", (socket) => {
  console.log("a user connected");
  // Tilldela X eller O till socket id (Hjälp från chat GPT för att få det att fungera)
  if (!players.X) {
    players.X = socket.id;
    socket.emit("playerType", "X");
  } else if (!players.O) {
    players.O = socket.id;
    socket.emit("playerType", "O");
  } else {
    socket.emit("full", "Spelet är fullt!");
    return;
  }

  // Skicka info om hur brädan ska uppdateras
  socket.emit("boardUpdate", board);

  // Hantera spelardrag
  socket.on("makeMove", (index) => {
    if (socket.id !== players[currentTurn]) return; // Här betyder att bara "O" kan spela om "X" precis gjorde sitt drag och tvärt om
    if (board[index] === null) {
      board[index] = currentTurn;
      currentTurn = currentTurn === "X" ? "O" : "X";
      io.emit("boardUpdate", board);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    if (players.X === socket.id) delete players.X;
    if (players.O === socket.id) delete players.O;
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
