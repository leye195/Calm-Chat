const nick=document.querySelector(".nickname"),login_page=document.querySelector(".login_page");
btns=document.querySelectorAll(".room button"),js_room=document.querySelector(".js_room"),
room_madal=document.querySelector(".room_modal"),exit_btn=document.querySelector(".exit_container"),
room_btns=document.querySelectorAll(".room_btns button"),room_input=document.querySelector(".room_input"),
room_ul=document.querySelector(".room_ul"),nav_item=document.querySelectorAll("nav a");
const r_socket=io();
const USER_NICK="USER_NICK";

function add_room(room){
    console.log(room);
    const li=create_tag(room);
    room_ul.appendChild(li);
}
function create_room(){
    const val=room_input.value;
    console.log(val);
    add_room(val);
    r_socket.emit('create room',val);
    r_socket.on('create room',(data)=>{
        if(data.room_name!==undefined){
            console.log(data);
            add_room(data.room_name);
        }
    })
    room_input.value="";
    _close();
}
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
    login_page.style.display="none";
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
    r_socket.emit('create room',"");
    r_socket.on('create room',(data)=>{
        if(data.room_name!==undefined)add_room(data.room_name);
    });
}
init();
