// Nödvändiga funktioner
const express = require("express");
const app = express();
const http = require("http");
const path = require("path"); // Path används för att start och index ska kunna kopplas
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const usernames = {}; // En metod för att Koppla socket.id till username

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "start.html"));
});

// Kopplar js sidan till (index.html)
app.get("/game", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Statiska filer från mapp, säger att alla html, js och css ska kunan nås
app.use(
  "/socket.io",
  express.static(path.join(__dirname, "node_modules/socket.io/client-dist"))
);

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
  io.emit("boardUpdate", {
    board: board,
    currentTurn: currentTurn,
  });

  socket.on("set username", (username) => {
    usernames[socket.id] = username;
    console.log(`Användare satt: ${username}`);

    // Servermeddelande till chatten om en spelare (username) har anslutit, den skickas i den synliga chatten
    io.emit("chat message", `Server: ${username} har anslutit till spelet.`);
  });

  // Hantera spelardrag
  socket.on("makeMove", (index) => {
    if (!gameActive) return; // Spelet kan ej fortsättas ifall någon vinner
    if (socket.id !== players[currentTurn]) return; // Här betyder att bara "O" kan spela om "X" precis gjorde sitt drag och tvärt om
    if (board[index] === null) {
      board[index] = currentTurn;
      const winner = checkWinner();
      if (winner) {
        gameActive = false;
        io.emit(
          "gameOver",
          winner === "draw" ? "It's a draw!" : `player ${winner} wins!`
        );

        // Lade till en till game over för mest att kunna lägga en message i chatten om vinnare
        if (winner === "draw") {
          io.emit("chat message", `Server: Spelet slutade oavgjort.`);
        } else {
          const winnerSocketId = players[winner];
          const winnerName = usernames[winnerSocketId] || `Spelare ${winner}`;
          io.emit("chat message", `Server: ${winnerName} (${winner}) Vann!`);
        }
      } else {
        currentTurn = currentTurn === "X" ? "O" : "X";
      }
      io.emit("boardUpdate", {
        board: board,
        currentTurn: currentTurn,
      });
    }
  });

  // Hantera spelåterställning
  socket.on("resetGame", () => {
    board = Array(9).fill(null);
    currentTurn = "X";
    gameActive = true;
    io.emit("boardUpdate", {
      board: board,
      currentTurn: currentTurn,
    });
    io.emit("chat message", `Server: Spelet har startats om.`);
    io.emit("resetGame");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    const username = usernames[socket.id] || "En spelare";
    io.emit("chat message", `Server: ${username} har lämnat spelet.`);
    if (players.X === socket.id) delete players.X;
    if (players.O === socket.id) delete players.O;
  });
  // Chat funktion och hanterar chat till klient (flytta hit för annars kraschar den)
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

// Servern körs på 3000 och i mitt fall: http://10.32.35.51:3000 (hemma i ett test fungerade bara ethernet adressen för att koppla)
server.listen(3000, "0.0.0.0", () => {
  console.log("Listening on: http://0.0.0.0:3000");
});
