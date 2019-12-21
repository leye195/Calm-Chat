const more_p=document.querySelector(".more_username"),account=document.querySelector(".account"),
login_page=document.querySelector(".login_page"),nick=document.querySelector(".nickname")
function load_username(){
    const username=sessionStorage.getItem("USER_NICK");
    more_p.textContent=username;
}
function change_name(){
    login_page.style.display="block";
}
function save_nickname(name){
    sessionStorage.setItem("USER_NICK",name);
    login_page.style.display="none";
}
function handleNickname(e){
    const target=e.target;
        if(e.keyCode===13){
            save_nickname(target.value);
            target.value="";
            load_username();
        }
}
function init(){
    load_username();
    account.addEventListener("click",change_name);
    nick.addEventListener("keydown",handleNickname);
}
init();