const express = require("express");
const app = express();
const WebSocketServer = require("ws").Server;
const path = require("path");
const port = 8010;
const root_port = 80;
const chatlog = [];
const anonyMode = false;

const server = app.listen(port, () => {
  if (process.send) {
    process.send(`Server running on port ${port}\n\n`);
  }
});

const rootServer = app.listen(root_port, () => {
  if (process.send) {
    process.send(`Root server running on port ${port}\n\n`);
  }
});

app.use("/", express.static(path.join(__dirname, "shell/")));

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

  systemBroadcast("Client has joined the chat.");
  websocketConnection.send(JSON.stringify(chatlog));

  websocketConnection.on("message", (message) => {
    let data;
    // Check is isJSON
    try {
      data = JSON.parse(message);
    } catch (error) {
      console.warn("[SUBSYSTEM] Format Unsupported");
      return;
    }

    // Check if there is a username

    if (!anonyMode) {
      if (
        "sendAs" in data === false ||
        data.sendAs == "undefined" ||
        data.sendAs == ""
      ) {
        console.warn("[SUBSYSTEM] Format Unsupported");
        systemBroadcast(
          "Cannot send message as <b>Anonymous</b>. Ask the server owner to enable this feature"
        );
        return;
      }
    }

    // Check if the user is using a reserved username

    if (
      data.sendAs.toString().toUpperCase() == "SYSTEM" ||
      data.sendAs.toString().toUpperCase() == "SUBSYSTEM"
    ) {
      console.warn("[SUBSYSTEM] Format Unsupported");
      systemBroadcast(
        'Cannot set username to a reserved username.'
      );
      return;
    }

    // Check if there is a message

    if (
      "message" in data === false ||
      data.message == "undefined" ||
      data.message == ""
    ) {
      console.warn("[SUBSYSTEM] Format Unsupported");
      systemBroadcast("You cannot send an empty message. Please, try again.");
      return;
    }
    console.log(data.sendAs, "-", data.message);
    data.timestamp = Date.now().toString(); // Milliseconds since UNIX Epoch
    chatlog.push(data);
    ws.broadcast(JSON.stringify(chatlog));
  });
});

ws.on("close", () => {
  console.log("[CONNECTION] Client has disconnected.");
  systemBroadcast("Client has disconnected from the chat.");
});

ws.broadcast = (data) => {
  ws.clients.forEach((client) => client.send(data));
};

function systemBroadcast(message) {
  chatlog.push({
    message: message,
    timestamp: Date.now().toString(),
    sendAs: "SYSTEM",
  });
  ws.broadcast(JSON.stringify(chatlog));
}
