const nick=document.querySelector(".nickname"),login_page=document.querySelector(".login_page");
btns=document.querySelectorAll(".room button"),js_room=document.querySelector(".js_room"),
room_madal=document.querySelector(".room_modal"),exit_btn=document.querySelector(".exit_container"),
room_btns=document.querySelectorAll(".room_btns button"),room_input=document.querySelector(".room_input"),
room_ul=document.querySelector(".room_ul");
const USER_NICK="USER_NICK";
function handleNickname(e){
    const target=e.target;
        if(e.keyCode===13){
            save_nickname(target.value);
            target.value="";
        }
}
function load_nickname(){
    const nickname=sessionStorage.getItem(USER_NICK);
    if(!nickname){login_page.style.display="block";}
    else{login_page.style.display="none";}
}   
function save_nickname(nickname){
    sessionStorage.setItem(USER_NICK,nickname);
    login_page.page.style.display="none";
}
function _open(){
    room_madal.style.display="block";
}
function _close(){
    room_madal.style.display="none";
}
function create_tag(name){
    const li=document.createElement("li"),div=document.createElement("div"),
    p=document.createElement("p"),button=document.createElement("button");
    div.classList.add("room");
    p.innerText=name;
    button.innerText="Enter";
    button.addEventListener("click",()=>{
        window.location.href=`/room/${name}`;
    })
    div.appendChild(p);
    div.appendChild(button);
    li.appendChild(div);
    return li;
}
function create_room(){
    const val=room_input.value;
    const li=create_tag(val);
    room_ul.appendChild(li);
    room_input.value="";
    _close();
}
function init(){
    load_nickname();
    nick.addEventListener("keydown",handleNickname);
    btns.forEach((item,i)=>{
        item.addEventListener("click",()=>{
            window.location.href=`/room/${i+1}`;
        })
    });
    js_room.addEventListener("click",_open);
    exit_btn.addEventListener("click",_close);
    room_btns[0].addEventListener("click",create_room);
    room_btns[1].addEventListener("click",_close);

}
init();
