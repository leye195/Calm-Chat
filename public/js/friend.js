const arrow=document.querySelector(".friend_arrow"),add_friend=document.querySelector(".js_friend"),
f_div=document.querySelector(".f_div"),f_input=document.querySelector(".friend_id"),clear_btn=document.querySelector(".friend_id+span");
function checkArrow(e){
    const {target}=e;
    if(target.classList.contains("up")){
        target.classList.remove("up");
        target.classList.add("down");
        target.src="/img/down_arrow.png";
    }else if(target.classList.contains("down")){
        target.classList.remove("down");
        target.classList.add("up");
        target.src="/img/up_arrow.png";
    }
}
function open_addFriend(){
    f_div.classList.toggle("hide");
}
function create_friend_tag(user_id){
    const li=document.createElement("li"),user_div=document.createElement("div"),img=new Image(),
    div=document.createElement("div"),p=document.createElement("p");
    p.className="username";
    p.textContent=user_id;
    img.src="/img/user.png";
    user_div.className="user_div";
    div.appendChild(p);
    user_div.appendChild(img);
    user_div.appendChild(div);
    li.appendChild(user_div);
    return li;
}
function handleAdd(e){
    const {target}=e;
    const f_list=document.querySelector(".friend_ul");
    if(e.keyCode===13){
        fetch(`user/${target.value}`)
        .then((data)=>data.text())
        .then((data)=>{
            const result=JSON.parse(data);
            console.log(result);
            if(result['error']===0&&result['success']===1){
                alert(JSON.stringify(result['result']));
                f_list.appendChild(create_friend_tag(result['result']['email']));
            }
        })
        target.value="";
    }
}
function init(){
    arrow.addEventListener("click",checkArrow);
    add_friend.addEventListener("click",open_addFriend);
    f_input.addEventListener("keyup",()=>{
        clear_btn.style.visibility = (f_input.value.length)?"visible":"hidden";
    });
    clear_btn.addEventListener("click",()=>{
        clear_btn.style.visibility = "hidden";
        f_input.value="";
    });
    f_input.addEventListener("keydown",handleAdd);
}
init();

