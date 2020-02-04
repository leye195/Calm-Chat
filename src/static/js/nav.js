const a=document.querySelectorAll("nav a");
function handleMenu(e){
    const{target}=e;
    console.log(target);
}
function init(){
    a.forEach((item)=>{
        item.addEventListener("click",handleMenu);
    })
}
init();