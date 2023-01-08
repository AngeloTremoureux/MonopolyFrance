const api_controller = require('./api/apiController');
const credentials = require('./tokens/tokens.json');
const jwt = require('jsonwebtoken');
const dataManager = require('./api/src/data');

// Use Express
var express = require("express");
var app = express();
const http = require('http');
// Use body-parser
var bodyParser = require("body-parser");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});
io.use((socket, next) => {
  // Récupérez le jeton JWT envoyé par l'utilisateur
  console.log("\x1b[0m[", socket.id, "]\x1b[1m\x1b[5m\x1b[33m", "⚙️  Global  > Client connected", "\x1b[0m")
  const { token, username } = socket.handshake.query;

  // Vérifiez la validité du jeton JWT en utilisant la clé secrète
  try {
    // Remplacez 'secret' par votre clé secrète
    if (!token || !username) {
      console.log("\x1b[0m[", socket.id, "]\x1b[1m\x1b[5m\x1b[31m", "❌ Global  > Client account not linked", "\x1b[0m");
      next();
    }
    dataManager.getPlayerByName(username).then((player) => {
      if (player && player.key) {
        const decoded = jwt.verify(token, player.key);
        socket.decoded = decoded;
        console.log("\x1b[0m[", socket.id, "]\x1b[1m\x1b[5m\x1b[32m", "✅ Global  > Client account linked (" + decoded.username + ")", "\x1b[0m")
      } else {
        console.log("\x1b[0m[", socket.id, "]\x1b[1m\x1b[5m\x1b[31m", "❌ Global  > Client account not linked", "\x1b[0m")
      }
      next();
    });
  } catch (error) {
    console.log("erreur ! ", error)
    next();
  }
});


// Create new instance of the express server

io.on("connection", (socket) => {
  api_controller.handleSocket(socket);
});

// Define the JSON parser as a default way
// to consume and produce data through the
// exposed APIs
app.use(bodyParser.json());

// Create link to Angular build directory
// The `ng build` command will save the result
// under the `dist` folder.
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Init the server
server.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("");
    console.log("     /)  (\\");
    console.log(".-._((,~~.))_.-,");
    console.log(" `-.   @@   ,-'");
    console.log("   / ,o--o. \\");
    console.log("  ( ( .__. ) )");
    console.log("   ) `----' (");
    console.log("  /          \ hjw");
    console.log(" /            \`97");
    console.log("/              \\");
    console.log("");
    console.log("🏐----------------------------------------------------------🏐");
    console.log("|                                                           |");
    console.log("| ✅  App backend now running. Visit http://localhost:" + port + "/" + " |");
    console.log("|                                                           |");
    console.log("🏐----------------------------------------------------------🏐");
    console.log("");
});


var indexApi = require('./api/routes');
const { use } = require('./api/routes');
app.use('/api', indexApi);


/*  "/api/status"
 *   GET: Get server status
 *   PS: it's just an example, not mandatory
 */
