const express = require("express");
const app = express();
const WebSocketServer = require("ws").Server;
const path = require("path");
const port = 8010;

const server = app.listen(port, () => {
  if (process.send) {
    process.send(`Server running on port ${port}\n\n`);
  }
});

app.use("/shell", express.static(path.join(__dirname, "shell/")));

// Gyro Server

// We then create a new variable which will store the actual server I'll be running
const ws = new WebSocketServer({
  // Then we set the parameter of httpServer to the server variable that we said that would be listening on the port specified
  //httpServer: server
  noServer: true,
});

server.on("upgrade", (request, socket, head) => {
  ws.handleUpgrade(request, socket, head, (websocket) => {
    ws.emit("connection", websocket, request);
  });
});

ws.on("connection", (websocketConnection) => {
  console.log("[CONNECTION] Client is Attempting To Connect!");

  websocketConnection.send(JSON.stringify(["OK"]));

  websocketConnection.on("message", (message) => {
    data = JSON.parse(message);
    console.log(data);
  });
});

// (((0.5 * 1920 * 100) / 1920) * 1920) / 100;

ws.on("close", () => {
  console.log("[CONNECTION] Client has disconnected.");
});
