const group = io.connect("/group"),
  personal = io.connect("/chat");
const f = document.querySelector("form"),
  input = document.querySelector("#m"),
  send = document.querySelector("#send"),
  u = document.querySelector("#message"),
  e_btn = document.querySelector(".exit_btn"),
  arrow = document.querySelector(".friend_arrow");
const USER_NAME = "USER_NAME";
//inform the number of participant in the room
function participantsMessage(data) {
  //let msg = `방 참가 인원: ${data.numbers}명`;
  //log(msg);
}
function log(msg) {
  const li = document.createElement("li");
  li.className = "log";
  li.innerText = `${msg}`;
  u.appendChild(li);
  u.scrollTop = u.scrollHeight;
}
function receiveTag(name, msg) {
  const li = document.createElement("li"),
    img = new Image(40, 40),
    span = document.createElement("span"),
    p = document.createElement("p");
  img.src = "/static/img/user.png";
  img.className = "user_img";
  span.className = "user_name";
  span.innerText = name;
  p.className = "user_msg";
  p.innerText = msg;
  li.appendChild(img);
  li.appendChild(span);
  li.appendChild(p);
  li.classList.add("msg_li");
  u.appendChild(li);
  u.scrollTop = u.scrollHeight;
}
function sendTag(name, msg) {
  const li = document.createElement("li"),
    img = new Image(40, 40),
    span = document.createElement("span"),
    p = document.createElement("p");
  img.src = "/static/img/user.png";
  span.className = "name_r";
  span.innerText = name;
  p.className = "msg_r";
  p.innerText = msg;
  li.appendChild(img);
  li.appendChild(span);
  li.appendChild(p);
  li.classList.add("msg_li");
  li.style.textAlign = "right";
  u.appendChild(li);
  u.scrollTop = u.scrollHeight;
}
function createChatTag(type, name, msg) {
  const id = window.location.href.split("/group/")[1];
  console.log(id);
  fetch(`/rooms/${id}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      msg
    })
  }).then(resolve => {
    console.log(resolve);
  });
  if (type === "send") {
    sendTag(name, msg);
  }
}
//load username from sessionStorage
function loadUser() {
  const user = sessionStorage.getItem(USER_NAME);
  log(`Welcome ${user}`);
  return user;
}
function loadChat() {
  let id;
  if (window.location.href.includes("group")) {
    id = window.location.href.split("/group/")[1];
    fetch(`/rooms/${id}/chat`)
      .then(resolve => {
        return resolve.json();
      })
      .then(data => {
        for (const iter of data) {
          const {
            msg,
            sender: { email }
          } = iter;
          if (email === loadUser()) {
            sendTag(email, msg);
          } else {
            receiveTag(email, msg);
          }
        }
      });
  }
}
function joinRoom(name) {
  const id = window.location.href.split("/group/")[1];
  fetch(`/rooms/${id}/join`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name
    })
  });
}
function leftRoom(name) {
  const id = window.location.href.split("/group/")[1];
  fetch(`/rooms/${id}/left`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name
    })
  });
}
function load_socket() {
  const name = loadUser(),
    room = window.location.pathname.split("/").slice(1, 3)[1],
    type = window.location.pathname.split("/").slice(1, 3)[0],
    r_id = window.location.href.split("/group/")[1];
  if (type === "group") {
    group.emit("joinRoom", room, name, r_id); //joinRoom
    //user submit the message
    f.addEventListener("submit", e => {
      e.preventDefault();
      group.emit("chat message", room, input.value, r_id);
      createChatTag("send", name, input.value);
      input.value = "";
      return false;
    });
    group.on("chat message", data => {
      //console.log("received: " + data);
      receiveTag(data.username, data.message);
    });
    group.on("leaveRoom", name => {
      log(`알림: ${name}님이 나가셨습니다`);
      leftRoom(name);
    });
    group.on("added", data => {
      participantsMessage(data);
    });
    group.on("joinRoom", data => {
      log(`알림: ${data.name}님이 들어오셨습니다`);
      participantsMessage(data);
      joinRoom(data.name);
    });
    e_btn.addEventListener("click", e => {
      if (window.confirm("정말 나가시겠습니까?")) {
        group.emit("leaveRoom", room, name, r_id);
        leftRoom();
        history.back();
      }
    });
  } else if (type === "chat") {
    personal.emit("joinRoom", room, name); //joinRoom
  }
}
function init() {
  document.body.scrollIntoView(false);
  loadChat();
  load_socket();
}
init();
