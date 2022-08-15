let mDb = [];
const __chat = document.getElementById("chat_container");
const chatTemplate = document.getElementById("chatTemplate");
class wsMsg {
  constructor(username, message) {
    this.message = message;
    this.sendAs = username;
  }
}

let ws;
let server = "127.0.0.1";
const address = `ws://${server}:8010/`;
let wsOpen = false;

if ("WebSocket" in window) {
  // Let us open a web socket
  ws = new WebSocket(address);

  ws.onopen = function () {
    // Web Socket is connected, send data using send()
    wsOpen = true;
  };
}

function send() {
  if (wsOpen) {
    const message = new wsMsg(username.value, contentBox.value);
    ws.send(
      JSON.stringify({ message: message.message, sendAs: message.sendAs })
    );
  }
}

// Listen for messages
ws.addEventListener("message", (event) => {
  //   console.log("Message from server ", event.data);
  mDb = JSON.parse(event.data);

  if (__chat.innerHTML == "") {
    mDb.forEach((message, index) => {
      __chat.innerHTML = `${__chat.innerHTML}${chatTemplate.innerHTML}`;
      m = sID("msg-container", index);
      //   m.timestamp, m.sender, m.message
      sID("timestamp", `${index}__ts`).innerHTML = new Date(
        parseInt(message.timestamp)*1000
      );
      sID("sender", `${index}__sndr`).innerHTML = message.sendAs;
      sID("message", `${index}__msg`).innerHTML = message.message;
    });
  }
});

function sID(od, nd) {
  od = document.getElementById(od);
  od.id = nd;
  return document.getElementById(nd);
}
