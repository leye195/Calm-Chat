(() => {
  let user = null;
  const form = document.querySelector(".form-container .message-form");
  const textArea = form.querySelector(".message-text"),
    sender = form.querySelector(".message-sender");
  const notice = document.querySelector(".message-count-joiner"),
    messageContainer = document.querySelector(".message-container");
  const loginContainer = document.querySelector(".login_page"),
    userName = document.querySelector(".u_name"),
    enterButton = document.querySelector(".login_btns .login"),
    frame = document.querySelector("#ytplayer");
  const clientSocket = io.connect("/");
  const setUserName = (name) => {
    sessionStorage.setItem("username", name);
    getUserName();
  };
  const getUserName = () => {
    if (sessionStorage.getItem("username")) {
      user = sessionStorage.getItem("username");
      loginContainer.classList.add("hide");
    }
  };
  const createNoticeMessage = (name, type) => {
    const messageDiv = document.createElement("div"),
      noticeMessage = document.createElement("p");
    noticeMessage.className = "message-notice";
    messageDiv.className = "message-item";
    if (type === "join") {
      noticeMessage.innerText = `${name}님이 캠프에 들어왔습니다.`;
    } else if (type === "leave") {
      noticeMessage.innerText = `${name}님이 캠프를 떠났습니다.`;
    }
    messageDiv.appendChild(noticeMessage);
    messageContainer.appendChild(messageDiv);
  };
  const createMessage = (type, data) => {
    const messageDiv = document.createElement("div"),
      userName = document.createElement("span"),
      userMessage = document.createElement("p");
    userName.className = "user-name";
    userMessage.className = "message-text";
    userMessage.innerText = data.text;
    if (type === "send") {
      userName.textContent = "나";
      userMessage.classList.add("left");
      messageDiv.className = "message-item left";
    } else if (type === "receive") {
      userName.textContent = data.name;
      userMessage.classList.add("right");
      messageDiv.className = "message-item right";
    }
    messageDiv.appendChild(userName);
    messageDiv.appendChild(userMessage);
    messageContainer.appendChild(messageDiv);
  };
  const onSetUserCount = (num) => {
    if (notice) {
      notice.textContent = `${num}명이 캠프에 있습니다`;
    }
  };
  const onJoin = () => {
    if (user !== null) {
      clientSocket.emit("join", user);
      clientSocket.on("join", (data) => {
        onSetUserCount(data.total);
        createNoticeMessage(data.name, "join");
      });
    }
  };
  const onLeft = () => {
    clientSocket.on("left", (data) => {
      onSetUserCount(data.total);
      createNoticeMessage(data.name, "leave");
    });
  };
  const onReceiveMessage = () => {
    clientSocket.on("receiveMessage", (data) => {
      createMessage("receive", data);
      messageContainer.scrollTo(0, messageContainer.scrollHeight);
    });
  };
  const onSendMessage = (message) => {
    clientSocket.emit("sendMessage", { name: user, text: message });
    createMessage("send", { name: user, text: message });
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const msg = textArea.value;
    if (msg.length > 0) {
      onSendMessage(msg);
      textArea.value = "";
    }
  };
  const onClickEnter = () => {
    if (userName.value !== "" && userName.value.length < 8) {
      setUserName(userName.value);
      onJoin();
      loginContainer.classList.add("hide");
    }
  };
  const onPressEnter = (e) => {
    const msg = textArea.value;
    if (e.keyCode === 13) {
      e.preventDefault();
      if (msg.length > 0) {
        sender.click();
      }
    }
  };
  const init = () => {
    form.addEventListener("submit", onSubmit);
    enterButton.addEventListener("click", onClickEnter);
    textArea.addEventListener("keydown", onPressEnter);
    onJoin();
    onLeft();
    onReceiveMessage();
  };
  init();
})();
