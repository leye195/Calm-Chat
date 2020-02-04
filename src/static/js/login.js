const login_page = document.querySelector(".login_page"),
  pwd = document.querySelector(".s_pwd"),
  pwd_again = document.querySelector(".s_pwd_again"),
  login_btn = document.querySelector(".login"),
  signup_btn = document.querySelector(".signup"),
  username = document.querySelector(".username"),
  login_form = document.querySelector(".login_form"),
  signup_form = document.querySelector(".signup_form"),
  cancel_btn = document.querySelector(".signup_cancel"),
  confirm_btn = document.querySelector(".signup_confirm");
const USER_NAME = "USER_NAME";
function handleLogin(e) {
  const u_name = document.querySelector(".u_name"),
    u_pwd = document.querySelector(".u_pwd");
  const name = u_name.value,
    pwd = u_pwd.value;
  fetch(`/login?email=${name}&pwd=${pwd}`)
    .then(res => res.text())
    .then(data => {
      const info = JSON.parse(data);
      console.log(JSON.parse(data));
      if (info["error"] === 0) {
        console.log(name);
        save_login(name);
      } else {
        alert("Login Failed");
      }
    });
  u_name.value = "";
  u_pwd.value = "";
}
function handleSignUp(e) {
  const email = document.querySelector(".s_name");
  console.log(pwd.value, pwd_again.value);
  if (pwd.value !== pwd_again.value) {
    alert("please check your password");
  } else {
    const options = {
      method: "post",
      body: JSON.stringify({ email: email.value, pwd: pwd.value }),
      headers: { "Content-type": "application/json" }
    };
    fetch(`/signup`, options)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data["error"] === 0) {
          alert("SignUp Success");
          changeTo();
        } else {
          alert("SignUp Failed");
        }
      });
  }
  email.value = "";
  pwd.value = "";
  pwd_again.value = "";
}
function changeTo() {
  login_form.classList.toggle("hide");
  signup_form.classList.toggle("hide");
}
function load_name() {
  const nickname = sessionStorage.getItem(USER_NAME);
  if (!nickname) {
    login_page.style.display = "block";
  } else {
    login_page.style.display = "none";
    if (username !== null) username.textContent = nickname;
  }
}
function save_login(name) {
  sessionStorage.setItem(USER_NAME, name);
  login_page.style.display = "none";
  load_name();
}
function init() {
  load_name();
  login_btn.addEventListener("click", handleLogin);
  signup_btn.addEventListener("click", changeTo);
  cancel_btn.addEventListener("click", changeTo);
  confirm_btn.addEventListener("click", handleSignUp);
}
init();
