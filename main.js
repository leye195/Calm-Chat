const express=require('express');
const app=express();
const http=require('http').createServer(app);
const io=require("socket.io")(http) 
//Initialize a new instance of socket.io by passing the http (the HTTP server) object
//then listen on the connection event for incoming socket
const port =  3030;
//let room=['room1','room2'],users=0;
let users=0;
var socketList=[]
app.use(express.static(__dirname + '/public'));
io.on('connection',(socket)=>{
    socket.on("leaveRoom",(room,name)=>{
        socket.leave(room,()=>{
            if(users>0)users--;
            io.to(room).emit("leaveRoom",name);
            socketList.splice(socketList.indexOf(socket), 1);
        });
    });
    socket.on("joinRoom",(room,name)=>{
        socket.username=name;
        socket.join(room,()=>{
            console.log(`${name} joined a ${room}`);
            users++;
            io.to(room).emit('joinRoom',{room:room,name:name,numbers:users});
            socketList.push(socket);
        });
    });
    socket.on('chat message',(room,msg)=>{
        //socketList.forEach((item)=>{
            //console.log("compare:"+(item===socket));
            //if(item!==socket){
            //console.log("name:"+item.username,msg);
                socket.to(room).broadcast.emit('chat message',{
                    username:socket.username,
                    message:msg
                });
            //}
        //})      
    });
    socket.on('create room',(data)=>{
        if(data===""){
            console.log(data);
            socket.broadcast.emit('create room',{
                room_name:undefined
            })
        }else{
            console.log(data);
            socket.broadcast.emit('create room',{
                room_name:data
            })
        }
    })
    socket.on('disconnect',()=>{
        console.log('user disconnected');
        socketList.splice(socketList.indexOf(socket), 1);
    });
});
//io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); 
// This will emit the event to all connected sockets

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