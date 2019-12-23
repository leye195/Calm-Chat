const more_p=document.querySelector(".more_username"),account=document.querySelector(".account"),
log_page=document.querySelector(".login_page");
function load_name(){
    const username=sessionStorage.getItem("USER_NAME");
    more_p.textContent=username;
}
function change_name(){
    log_page.style.display="block";
}
function init(){
    load_name();
    account.addEventListener("click",change_name);
}
init();