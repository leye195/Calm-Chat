const btns=document.querySelectorAll(".g_room button"),js_room=document.querySelector(".js_room"),
room_madal=document.querySelector(".room_modal"),exit_btn=document.querySelector(".exit_container"),
room_btns=document.querySelectorAll(".room_btns button"),room_input=document.querySelector(".room_input"),
room_ul=document.querySelector(".room_ul"),nav_item=document.querySelectorAll("nav a"),
one=document.querySelector(".one"),group=document.querySelector(".group"),
one_list=document.querySelector(".one_list"),group_list=document.querySelector(".group_list");
const r_socket=io();
function create_room(){
    const val=room_input.value;
    if(group.classList.contains("menu_active")){
        add_room(val,"group");
        r_socket.emit('create room',val);
        r_socket.on('create room',(data)=>{
            if(data.room_name!==undefined){
                console.log(data);
                add_room(data.room_name,"group");
            }
        });
    }else if(one.classList.contains("menu_active")){
        add_room(val,"personal");
        r_socket.emit('create room',val);
        r_socket.on('create room',(data)=>{
            if(data.room_name!==undefined){
                console.log(data);
                add_room(data.room_name,"personal");
            }
        });
    }
    room_input.value="";
    _close();
}
function _open(){room_madal.style.display="block";}
function _close(){room_madal.style.display="none";}
function add_room(room,type){
    const li=create_tag(room,type);
    if(type==="group")group_list.appendChild(li);
    else if(type==="personal")one_list.appendChild(li);
}
function create_tag(name,type){
    const li=document.createElement("li"),div=document.createElement("div"),
    r_div=document.createElement("div"),img=new Image();
    if(type==="group"){
        const span=document.createElement("span");
        div.classList.add("g_room");
        img.src="/img/group.png";
        img.className="group_img";
        span.innerText=name;
        r_div.appendChild(img);
        r_div.appendChild(span);
        div.appendChild(r_div);
    }else if(type==="personal"){
        const p1=document.createElement("p"),p2=document.createElement("p");
        div.classList.add("o_room");
        img.src="/img/user.png";
        img.className="user_img";
        p1.textContent=name;
        p2.textContent="";
        r_div.appendChild(p1);
        r_div.appendChild(p2);
        div.appendChild(img);
        div.appendChild(r_div);
        div.addEventListener("click",()=>{
            window.location.href=`/chat/${name}`;
        });
    }
    li.appendChild(div);
    return li;
}
function toOne(e){
    if(!one.classList.contains("menu_active")){
        one.classList.toggle("menu_active");
        group.classList.toggle("menu_active");
        one_list.style.display="block";
        group_list.style.display="none";
    }
}
function toGroup(e){
    if(!group.classList.contains("menu_active")){
        one.classList.toggle("menu_active");
        group.classList.toggle("menu_active");
        group_list.style.display="block";
        one_list.style.display="none";
    }
}
function init(){
    group_list.addEventListener("click",(e)=>{
        const {target}=e;
        const name=target.querySelector("span").textContent;
        window.location.href=`/group/${name}`;
    })
    js_room.addEventListener("click",_open);
    exit_btn.addEventListener("click",_close);
    room_btns[0].addEventListener("click",create_room);
    room_btns[1].addEventListener("click",_close);
    r_socket.emit('create room',"");
    r_socket.on('create room',(data)=>{
        if(data.room_name!==undefined)add_room(data.room_name);
    });
    one.addEventListener("click",toOne);
    group.addEventListener("click",toGroup);
}
init();
