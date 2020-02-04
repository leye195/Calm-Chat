const clock=document.querySelector(".clock");
function get_clock(){
    const t=new Date();
    const h=t.getHours(),m=t.getMinutes();
    const msg=`${h>12?h-12:h}:${m<10?`0${m}`:m} ${h>=12?'PM':'AM'}`;
    clock.textContent=msg;
}
function init(){
    get_clock();
    setInterval(get_clock,1000);
}
init();