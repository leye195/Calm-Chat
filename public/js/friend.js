const arrow=document.querySelector(".friend_arrow"),add_friend=document.querySelector(".js_friend"),
f_div=document.querySelector(".f_div"),f_input=document.querySelector(".friend_id"),
clear_btn=document.querySelector(".friend_id+span"),friend_info=document.querySelector(".friend_info")
p_s=document.querySelectorAll(".info_form p"),add_btn=document.querySelector(".info_form button"),
f_ul=document.querySelector(".friend_ul"),friend_div=document.querySelector(".friend_div");
function checkArrow(e){
    const {target}=e;
    if(target.classList.contains("up")){
        target.classList.remove("up");
        target.classList.add("down");
        target.src="/img/down_arrow.png";
        f_ul.classList.add("f_up");
        f_ul.classList.remove("f_down");
        friend_div.style.borderBottom="1px solid #ececec";
    }else if(target.classList.contains("down")){
        target.classList.remove("down");
        target.classList.add("up");
        target.src="/img/up_arrow.png";
        f_ul.classList.add("f_down");
        f_ul.classList.remove("f_up");
        friend_div.style.borderBottom="none"
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
function checkSame(n1,n2){
    console.log(n1,n2);
    return n1===n2;
}
function handleInfo(e){
    const {target}=e;
    if(e.keyCode===13){
        fetch(`friend/${target.value}`)
        .then((data)=>data.text())
        .then((data)=>{
            const result=JSON.parse(data);
            //console.log(result);
            if(result['error']===0&&result['success']===1){
                //alert(JSON.stringify(result['result']));
                friend_info.classList.toggle("hide");
                p_s[1].textContent=result['result']['email'];
                if(checkSame(document.querySelector(".profile_main .username").textContent,p_s[1].textContent)){
                    add_btn.disabled=true;
                }
            }
        })
        target.value="";
    }
}
function handleAdd(e){
    const{target}=e,f_list=document.querySelector(".friend_ul");
    const my=document.querySelector(".profile_main .username").textContent;
    if(!checkSame(my,p_s[1].textContent)){
        const options = {
            method: 'post',
            body: JSON.stringify({my:my,email:p_s[1].textContent}),
            headers: {'Content-type': 'application/json'},
        }
        fetch(`/add_friend`,options)
        .then((res)=>res.json())
        .then((data)=>{
            if(data['error']===0){
                alert("Add Success");
                friend_info.classList.toggle("hide");
                f_list.appendChild(create_friend_tag(p_s[1].textContent));
            }else if(data['error']===3){
                alert(data['msg']);    
            }
        })
    } 
}
function load_friendList(){
    const myid=document.querySelector(".profile_main .username").textContent;
    if(myid!=="Username"){
        fetch(`/friend_list/${myid}`)
        .then((res)=>res.text())
        .then((res)=>{
            const result=new Set((JSON.parse(res))['result']);
            result.forEach(item => {
                f_ul.appendChild(create_friend_tag(item));
            }); 
        })
    }
}
function init(){
    load_friendList();
    arrow.addEventListener("click",checkArrow);
    add_friend.addEventListener("click",open_addFriend);
    f_input.addEventListener("keyup",()=>{
        clear_btn.style.visibility = (f_input.value.length)?"visible":"hidden";
    });
    clear_btn.addEventListener("click",()=>{
        clear_btn.style.visibility = "hidden";
        f_input.value="";
    });
    f_input.addEventListener("keydown",handleInfo);
    p_s[0].addEventListener("click",()=>{
        friend_info.classList.toggle("hide");
        add_btn.disabled=false;
    });
    add_btn.addEventListener("click",handleAdd);
}
init();

