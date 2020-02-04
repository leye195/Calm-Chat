const more_p=document.querySelector(".more_username"),account=document.querySelector(".account");
function load_name(){
    const username=sessionStorage.getItem("USER_NAME");
    more_p.textContent=username;
}
function log_out(){
    sessionStorage.removeItem("USER_NAME");
    window.location.href="/";
}
function init(){
    load_name();
    account.addEventListener("click",log_out);
}
init();