let mDb = [];
let last_ts = 0;
const __chat = document.getElementById("chat_container");
const chatTemplate = document.getElementById("chatTemplate");
class wsMsg {
  constructor(username, message) {
    this.message = message;
    this.sendAs = username;
  }
}

let ws;
let address;
server_addr.addEventListener("keyup", () => {
  address = server_addr.value;
});
let wsOpen = false;

function init() {
  if ("WebSocket" in window) {
    // Let us open a web socket
    ws = new WebSocket(address);

    ws.onopen = function () {
      // Web Socket is connected, send data using send()
      wsOpen = true;
      listen();
    };
  }
}

function send() {
  if (wsOpen) {
    const message = new wsMsg(username.value, contentBox.value);
    ws.send(
      JSON.stringify({ message: message.message, sendAs: message.sendAs })
    );
  }
}

function listen() {
  // Listen for messages
  ws.addEventListener("message", (event) => {
    //   console.log("Message from server ", event.data);
    console.log("Message from server");
    mDb = JSON.parse(event.data);

    if (__chat.innerHTML == "") {
      mDb.forEach((message, index) => {
        __chat.innerHTML = `${__chat.innerHTML}${chatTemplate.innerHTML}`;
        m = sID("msg-container", index);
        //   m.timestamp, m.sender, m.message
        sID("timestamp", `${index}__ts`).innerHTML = new Date(
          parseInt(message.timestamp)
        ).toLocaleString([], {
          timeStyle: "short",
        });
        sID("sender", `${index}__sndr`).innerHTML = message.sendAs;
        sID("message", `${index}__msg`).innerHTML = message.message;
        last_ts = message.timestamp; // Speed messaging enabled
      });
    } else {
      mDb.forEach((message, index) => {
        // console.log(
        //   parseInt(message.timestamp),
        //   parseInt(last_ts),
        //   parseInt(message.timestamp) > parseInt(last_ts),
        //   index
        // );
        if (parseInt(message.timestamp) > parseInt(last_ts)) {
          __chat.innerHTML = `${__chat.innerHTML}${chatTemplate.innerHTML}`;
          m = sID("msg-container", index);
          //   m.timestamp, m.sender, m.message
          sID("timestamp", `${index}__ts`).innerHTML = new Date(
            parseInt(message.timestamp)
          ).toLocaleString([], {
            timeStyle: "short",
          });
          sID("sender", `${index}__sndr`).innerHTML = message.sendAs;
          sID("message", `${index}__msg`).innerHTML = message.message;
          last_ts = message.timestamp; // speed messaging enabled
        }
      });
    }
  });
}

function sID(od, nd) {
  od = document.getElementById(od);
  od.id = nd;
  return document.getElementById(nd);
}
