// Nödvändiga funktioner
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Kopplar js sidan till (index.html)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// (FYI) Socket.id är det id en user får när den ansluter och är inte players
let players = {}; // Sparar spelare som ansluter
let board = Array(9).fill(null); // Tre i rad spelyta
let currentTurn = "X"; // Börjar med att X alltid börjar spelet. Kommer ändra till varannan turn senare när spelet fungerar
let gameActive = true; // en variabel för ifall spelet är igång eller någon har vunnit eller förlorat

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rader
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Kolumner
  [0, 4, 8],
  [2, 4, 6], // Diagonaler
];

function checkWinner() {
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes(null) ? null : "draw";
}

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

  // Skicka info till html om hur brädan ska uppdateras
  socket.emit("boardUpdate", board);

  // Hantera spelardrag
  socket.on("makeMove", (index) => {
    if (!gameActive) return; // Spelet kan ej fortsättas ifall någon vinner
    if (socket.id !== players[currentTurn]) return; // Här betyder att bara "O" kan spela om "X" precis gjorde sitt drag och tvärt om
    if (board[index] === null) {
      board[index] = currentTurn;
      const winner = checkWinner();
      if (winner) {
        gameActive = false; // Stoppa spelet
        io.emit(
          "gameOver",
          winner === "draw" ? "It's a draw!" : `player ${winner} wins!`
        );
      } else {
        currentTurn = currentTurn === "X" ? "O" : "X";
      }
      io.emit("boardUpdate", board);
    }
  });

  // Hantera spelåterställning
  socket.on("resetGame", () => {
    board = Array(9).fill(null);
    currentTurn = "X";
    gameActive = true;
    io.emit("boardUpdate", board);
    io.emit("resetGame");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    if (players.X === socket.id) delete players.X;
    if (players.O === socket.id) delete players.O;
  });
  // Chat funktion och hanterar chat till klient (flytta hit för annars kraschar den)
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

// Sparar dessa rader ifall chatbot i Tre i rad spel (FUNKTION)
// //cmd visar msg
// io.on("connection", (socket) => {
//   socket.on("chat message", (msg) => {
//     console.log("message: " + msg);
//   });
// });

// io.emit("some event", {
//   someProperty: "some value",
//   otherProperty: "other value",
// }); // This will emit the event to all connected sockets

// io.on("connection", (socket) => {
//   socket.broadcast.emit("hi");
// });

// Servern körs på 3000 och i mitt fall: http://10.32.35.51:3000
server.listen(3000, "0.0.0.0", () => {
  console.log("Listening on: http://0.0.0.0:3000");
});
