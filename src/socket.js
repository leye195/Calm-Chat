let userList = [];
const socket = (io) => {
  const chat = io.on("connection", (socket) => {
    socket.on("join", (data) => {
      userList.push({ id: socket.id, name: data });
      io.emit("join", { id: socket.id, name: data, total: userList.length });
    });
    socket.on("sendMessage", (data) => {
      console.log(data);
      socket.broadcast.emit("receiveMessage", {
        id: socket.id,
        name: data.name,
        text: data.text,
      });
    });
    socket.on("disconnect", () => {
      const user = userList.filter((user) => user.id === socket.id)[0];
      userList = userList.filter((user) => user.id !== socket.id);
      console.log("user disconnected");
      if (user) {
        io.emit("left", {
          id: socket.id,
          name: user.name,
          total: userList.length,
        });
      }
    });
  });
};
export default socket;
