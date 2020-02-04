const btns = document.querySelectorAll(".g_room button"),
  js_room = document.querySelector(".js_room"),
  room_madal = document.querySelector(".room_modal"),
  exit_btn = document.querySelector(".exit_container"),
  room_btns = document.querySelectorAll(".room_btns button"),
  room_input = document.querySelector(".room_input"),
  room_ul = document.querySelector(".room_ul"),
  nav_item = document.querySelectorAll("nav a"),
  one = document.querySelector(".one"),
  group = document.querySelector(".group"),
  one_list = document.querySelector(".one_list"),
  group_list = document.querySelector(".group_list");
const r_socket = io.connect("/");
function create_room() {
  const val = room_input.value;
  if (group.classList.contains("menu_active")) {
    add_room(val, "group");
    r_socket.emit("create room", val);
    r_socket.on("create room", data => {
      if (data.room_name !== undefined) {
        add_room(data.room_name, "group");
      }
    });
  } else if (one.classList.contains("menu_active")) {
    add_room(val, "personal");
    r_socket.emit("create room", val);
    r_socket.on("create room", data => {
      if (data.room_name !== undefined) {
        add_room(data.room_name, "personal");
      }
    });
  }
  room_input.value = "";
  _close();
}
function load_rooms() {
  //load room list
  fetch(`/rooms/room`)
    .then(resolve => {
      return resolve.json();
    })
    .then(data => {
      data.forEach(item => {
        const { title, type, _id } = item;
        const li = create_tag(title, type, _id);
        if (type === "group") {
          group_list.appendChild(li);
        } else if (type === "personal") {
          one_list.appendChild(li);
        }
      });
    });
}
function _open() {
  room_madal.style.display = "block";
}
function _close() {
  room_madal.style.display = "none";
}
function add_room(room, type) {
  const li = create_tag(room, type);
  fetch(`/rooms/room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type,
      title: room,
      id: sessionStorage.getItem("USER_NAME")
    })
  })
    .then(resolve => {
      if (resolve.status === 200) {
        return resolve.json();
      }
    })
    .then(data => {
      if (type === "group") {
        group_list.appendChild(li);
      } else if (type === "personal") {
        one_list.appendChild(li);
      }
    });
  r_socket.emit("createRoom", title);
  r_socket.on("createRoom", data => {
    if (data.room_name !== undefined) add_room(data.room_name);
  });
}
function create_tag(name, type, id) {
  const li = document.createElement("li"),
    div = document.createElement("div"),
    r_div = document.createElement("div"),
    img = new Image(),
    btn = document.createElement("button");
  btn.innerText = "X";
  btn.addEventListener("click", handleClick);
  if (type === "group") {
    const span = document.createElement("span");
    div.classList.add("g_room");
    img.src = "/static/img/group.png";
    img.className = "group_img";
    span.innerText = name;
    r_div.appendChild(img);
    r_div.appendChild(span);
    r_div.id = id;
    div.appendChild(r_div);
  } else if (type === "personal") {
    const p1 = document.createElement("p"),
      p2 = document.createElement("p");
    div.classList.add("o_room");
    img.src = "/static/img/user.png";
    img.className = "user_img";
    p1.textContent = name;
    p2.textContent = "";
    r_div.appendChild(p1);
    r_div.appendChild(p2);
    div.appendChild(img);
    div.appendChild(r_div);
    div.id = id;
    div.addEventListener("click", () => {
      window.location.href = `/chat/${id}`;
    });
  }
  li.appendChild(div);
  li.append(btn);
  li.addEventListener("mouseover", () => {
    btn.style.display = "block";
  });
  li.addEventListener("mouseleave", () => {
    btn.style.display = "none";
  });
  return li;
}
function handleClick(e) {
  const { target } = e;
  console.log(target);
}
function toOne(e) {
  if (!one.classList.contains("menu_active")) {
    one.classList.toggle("menu_active");
    group.classList.toggle("menu_active");
    one_list.style.display = "block";
    group_list.style.display = "none";
  }
}
function toGroup(e) {
  if (!group.classList.contains("menu_active")) {
    one.classList.toggle("menu_active");
    group.classList.toggle("menu_active");
    group_list.style.display = "block";
    one_list.style.display = "none";
  }
}
function init() {
  js_room.addEventListener("click", _open);
  exit_btn.addEventListener("click", _close);
  room_btns[0].addEventListener("click", create_room);
  room_btns[1].addEventListener("click", _close);
  one.addEventListener("click", toOne);
  group.addEventListener("click", toGroup);
  load_rooms();
  group_list.addEventListener("click", e => {
    const { target } = e;
    if (target.tagName !== "BUTTON") {
      window.location.href = `/group/${target.id}`;
    }
  });
}
init();
