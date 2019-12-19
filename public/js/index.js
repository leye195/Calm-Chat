const socket=io();
const f=document.querySelector("form"),input=document.querySelector("#m"),
    send=document.querySelector("#send"),u=document.querySelector("#message"),
    e_btn=document.querySelector(".exit_btn");
const USER_NICK="USER_NICK";
function participantsMessage(data){
    let msg="";
    if(data.numbers===1)msg='there are 1 participants';
    else msg=`there are ${data.numbers} participants in the room`;
    log(msg);
}
function log(msg){
    const li=document.createElement("li");
    li.className="log";
    li.innerText=`${msg}`;
    u.appendChild(li);
}
function sendMessage(name,msg){
    const li=document.createElement("li");
    const img=new Image(40,40),span=document.createElement("span"),p=document.createElement("p");
    img.src="/img/user.png";
    img.className="user_img";
    span.className="user_name";
    span.innerText=name;
    p.className="user_msg";;
    p.innerText=msg;
    li.appendChild(img);
    li.appendChild(span);
    li.appendChild(p);
    li.classList.add("msg_li");
    li.classList.add(name);
    u.appendChild(li);
}
function loadUser(){
    const user=sessionStorage.getItem(USER_NICK);
    log(`Welcome ${user}`);
    return user;
}
function load_socket(){
    const name=loadUser(),num=((window.location.pathname).split("/").slice(-1))-1;
    socket.emit('joinRoom',num,name);//joinRoom 
    f.addEventListener('submit',(e)=>{
        e.preventDefault();
        socket.emit('chat message',num,name,input.value);
        input.value="";
        return false;
    });
    socket.on('chat message',(num,name,msg)=>{
        sendMessage(name,msg)
    });
    socket.on('leaveRoom',(num,name)=>{
        log(`${name} leaved`)
    });
    socket.on('added',(data)=>{
        participantsMessage(data);
    })
    socket.on('joinRoom',(num,name)=>{
        log(`${name} joined`)
    });
    e_btn.addEventListener("click",(e)=>{
        if(window.confirm("Do you want to leave?")){
            socket.emit('leaveRoom',num,name);
            history.back();
        }        
    })
}
function init(){
    load_socket()
}
init();