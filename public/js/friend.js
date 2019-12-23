const arrow=document.querySelector(".friend_arrow");
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
arrow.addEventListener("click",checkArrow);