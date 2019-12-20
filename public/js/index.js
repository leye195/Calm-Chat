const socket=io();
const f=document.querySelector("form"),input=document.querySelector("#m"),
    send=document.querySelector("#send"),u=document.querySelector("#message"),
    e_btn=document.querySelector(".exit_btn");
const USER_NICK="USER_NICK";
//inform the number of participant in the room
function participantsMessage(data){
    let msg=`방 참가 인원: ${data.numbers}명`;
    log(msg);
}
//
function log(msg){
    const li=document.createElement("li");
    li.className="log";
    li.innerText=`${msg}`;
    u.appendChild(li);
    u.scrollTop = u.scrollHeight;
}
function receiveMessage(name,msg){
    const li=document.createElement("li"),img=new Image(40,40),
    span=document.createElement("span"),p=document.createElement("p");
    img.src="/img/user.png";
    img.className="user_img";
    span.className="user_name";
    span.innerText=name;
    p.className="user_msg";
    p.innerText=msg;
    li.appendChild(img);
    li.appendChild(span);
    li.appendChild(p);
    li.classList.add("msg_li");
    u.appendChild(li);
    u.scrollTop = u.scrollHeight;
}
function sendMessage(name,msg){
    const li=document.createElement("li"),img=new Image(40,40),
    span=document.createElement("span"),p=document.createElement("p");
    img.src="/img/user.png";
    span.className="name_r";
    span.innerText=name;
    p.className="msg_r";
    p.innerText=msg;
    li.appendChild(img);
    li.appendChild(span);
    li.appendChild(p);
    li.classList.add("msg_li");
    li.style.textAlign="right";
    u.appendChild(li);
    u.scrollTop = u.scrollHeight;
}

//load username from sessionStorage
function loadUser(){
    const user=sessionStorage.getItem(USER_NICK);
    log(`Welcome ${user}`);
    return user;
}
function load_socket(){
    const name=loadUser(),room=((window.location.pathname).split("/").slice(-1))-1;
    socket.emit('joinRoom',room,name);//joinRoom 
    //user submit the message
    f.addEventListener('submit',(e)=>{
        e.preventDefault();
        socket.emit('chat message',room,input.value);
        sendMessage(name,input.value);
        input.value="";
        return false;
    });
    socket.on('chat message',(data)=>{
        console.log("received: "+data);
        receiveMessage(data.username,data.message);
    });
    socket.on('leaveRoom',(name)=>{
        log(`알림: ${name}님이 나가셨습니다`)
    });
    socket.on('added',(data)=>{
        participantsMessage(data);
    })
    socket.on('joinRoom',(data)=>{
        log(`알림: ${data.name}님이 들어오셨습니다`);
        participantsMessage(data);
    });
    socket.on('typing',(data)=>{
        console.log(data);
    })
    e_btn.addEventListener("click",(e)=>{
        if(window.confirm("정말 나가시겠습니까?")){
            socket.emit('leaveRoom',room,name);
            history.back();
        }        
    });
}
function init(){
    document.body.scrollIntoView(false)
    load_socket()
}
init();