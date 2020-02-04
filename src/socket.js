const socket = io => {
  const main = io.on("connection", socket => {
    socket.on("createRoom", data => {
      if (data === "") {
        console.log(data);
        socket.broadcast.emit("createRoom", {
          room_name: undefined
        });
      } else {
        console.log(data);
        socket.broadcast.emit("createRoom", {
          room_name: data
        });
      }
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
  const group = io.of("/group").on("connection", socket => {
    const users = [];
    socket.on("joinRoom", (room, name, r_id) => {
      socket.username = name;
      socket.join(r_id);
      group.to(r_id).emit("joinRoom", {
        room: room,
        name: name,
        numbers: users.length
      });
    });
    socket.on("leaveRoom", (room, name, r_id) => {
      socket.leave(r_id, () => {
        group.to(r_id).emit("leaveRoom", name);
        users.splice(users.indexOf(socket.id), 1);
      });
    });
    socket.on("chat message", (room, msg, r_id) => {
      //let all client receive the message
      socket.broadcast.to(r_id).emit("chat message", {
        username: socket.username,
        message: msg
      });
    });
    socket.on("disconnection", () => {});
  });
};
export default socket;
