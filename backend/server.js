const api_controller = require('./api/apiController');

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

// Create new instance of the express server

io.on("connection", (socket) => {
  console.log("\x1b[0m[", socket.id, "]\x1b[1m\x1b[5m\x1b[32m", "Global  > Client connected", "\x1b[0m")
  api_controller.manageSocket(socket);
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
    console.log("|                                                            |");
    console.log("| ✅ - App backend now running. Visit http://localhost:" + port + "/" + " |");
    console.log("|                                                            |");
    console.log("🏐----------------------------------------------------------🏐");
    console.log("");
});


var indexApi = require('./api/routes');
app.use('/api', indexApi);


/*  "/api/status"
 *   GET: Get server status
 *   PS: it's just an example, not mandatory
 */
