// Frontend.js - Enables the interaction with the backend.

let mDb = [];
let last_ts = 0;
const __chat = document.getElementById("chat_container");
const chatTemplate = document.getElementById("chatTemplate");
const scriptTest = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
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
      // Enable message sending
      if (MCC_1.hasAttribute("disabled")) {
        MCC_1.toggleAttribute("disabled");
      }
      contentBox.placeholder = "Type a message";
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
  // Scroll down right after message is sent. WebSocket's connection delay is approximately 200ms
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight);
    contentBox.value = "";
  }, 250);
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
        if (!scriptTest.test(message.sendAs)) {
          sID("sender", `${index}__sndr`).innerHTML = message.sendAs;
        } else {
          sID("sender", `${index}__sndr`).innerHTML =
            "<i>Content Sanitized</i>";
        }

        if (!scriptTest.test(message.message)) {
          // Patchwork: Convert \n \b into <br/>
          // sID("message", `${index}__msg`).innerHTML = message.message;
          sID("message", `${index}__msg`).textContent = message.message;
        } else {
          sID("message", `${index}__msg`).innerHTML =
            "<i>Content Sanitized</i>";
        }
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

          // This comes from the server, don't need to test since
          // it'll just fail the conversion if it's not a valid timestamp

          sID("timestamp", `${index}__ts`).innerHTML = new Date(
            parseInt(message.timestamp)
          ).toLocaleString([], {
            timeStyle: "short",
          });
          if (!scriptTest.test(message.sendAs)) {
            sID("sender", `${index}__sndr`).innerHTML = message.sendAs;
          } else {
            sID("sender", `${index}__sndr`).innerHTML =
              "<i>Content Sanitized</i>";
          }

          if (!scriptTest.test(message.message)) {
            // Patchwork: Convert \n \b into <br/>
            // sID("message", `${index}__msg`).innerHTML = message.message;
            sID("message", `${index}__msg`).textContent = message.message;
          } else {
            sID("message", `${index}__msg`).innerHTML =
              "<i>Content Sanitized</i>";
          }
          last_ts = message.timestamp; // speed messaging enabled
        }
      });
    }
    // By all means, scroll to bottom of page
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
      // contentBox.value = "";
    }, 250);
  });

  ws.addEventListener("close", () => {
    if (!MCC_1.hasAttribute("disabled")) {
      MCC_1.toggleAttribute("disabled");
    }
    contentBox.placeholder = "You have been disconnected from the server.";
  });
}

function sID(od, nd) {
  od = document.getElementById(od);
  od.id = nd;
  return document.getElementById(nd);
}
