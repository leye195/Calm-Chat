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
function add_list(){
    const friend_id=document.querySelector(".friend_id");
    console.log(friend_id.value);

}
arrow.addEventListener("click",checkArrow);
add_friend.addEventListener("click",open_addFriend);
f_input.addEventListener("keyup",()=>{
    clear_btn.style.visibility = (f_input.value.length)?"visible":"hidden";
})
clear_btn.addEventListener("click",()=>{
    clear_btn.style.visibility = "hidden";
    f_input.value="";
})
console.log(clear_btn);
