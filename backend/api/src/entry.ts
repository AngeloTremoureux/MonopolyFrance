import { handleSocket } from '../apiController';
import credentials from './../../tokens/tokens.json';
import jwt from 'jsonwebtoken';
import * as data from "./data";
import express from "express";
import http from 'http';
import { Server, Socket } from "socket.io";
import bodyParser from "body-parser";

const frontendUri = "http://localhost:4200";
const app = express();
const server = http.createServer(app);

const io: Server<any> = new Server(server, {
  cors: {
    origin: frontendUri,
    methods: ["GET", "POST"]
  }
});

io.use((socket: Socket, next) => {
  console.log("\x1b[0m[", socket.id, "]\x1b[1m\x1b[5m\x1b[33m", "⚙️  Global  > Client connected", "\x1b[0m");
  const { token, username } = socket.handshake.query;
  try {
    if (typeof (token) !== 'string' || typeof (username) !== 'string') {
      console.log("\x1b[0m[", socket.id, "]\x1b[1m\x1b[5m\x1b[31m", "❌ Global  > Client account not linked", "\x1b[0m");
      next();
      return;
    }
    data.getPlayerByName(username).then((player: any) => {
      if (player && player.key) {
        const decoded: any = jwt.verify(token, player.key);
        (socket as any).decoded = decoded;
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
  handleSocket(socket, io);
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
  const adress = server.address();
  if (!adress || typeof(adress) != "object") return;
  var port = adress.port;
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
