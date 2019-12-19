const express=require('express');
const app=express();
const http=require('http').createServer(app);
const io=require("socket.io")(http) 
//Initialize a new instance of socket.io by passing the http (the HTTP server) object
//then listen on the connection event for incoming socket
const port =  3030;
let room=['room1','room2'],users=0;
let cnt=0;
app.use(express.static(__dirname + '/public'));
io.on('connection',(socket)=>{
    socket.on('disconnect',()=>{
        console.log('user disconnected');
    });
    socket.on("leaveRoom",(num,name)=>{
        socket.leave(room[num],()=>{
            if(users>0)users--;
            console.log(`${name} leave a ${room[num]}`);
            io.to(room[num]).emit("leaveRoom",num,name);
            console.log(users);
        });
    });
    socket.on("joinRoom",(num,name)=>{
        socket.join(room[num],()=>{
            console.log(`${name} joined a ${room[num]}`);
            users++;
            io.to(room[num]).emit('joinRoom',num,name);
            io.to(room[num]).emit('login',{
                numbers:users
            });
            //// echo globally (all clients) that a person has connected
            socket.broadcast.to(room[num]).emit('added',{//본인을 제외한 모든 사람에게 전달
                username:name,
                numbers:users
            });
            console.log("nums:"+users);
        });
    });
    socket.on('chat message',(num,name,msg)=>{
        cnt=num;
        io.to(room[cnt]).emit('chat message',num,name,msg);
    });
});
//io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); 
// This will emit the event to all connected sockets
const namespace1=io.of('/room1');
namespace1.on('connection',(socket)=>{  
    namespace1.emit('news',{hello:'newssss'});
})
//socket.join()으로 room 접속, socket.leave()으로 room 나감, io.to() 특정 room에 이벤트 보내기
//io.to("").emit("");


app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/html/index.html');
})
app.get('/room/:room_name',(req,res)=>{
    res.sendFile(__dirname+'/public/html/room.html');
})
//app.listen(port,()=>console.log(`Sever is running on ${port}`))
http.listen(port,()=>console.log(`Connected to ${port}`));