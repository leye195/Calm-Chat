import express from "express";
import roomModel from "../model/room";
import userModel from "../model/user";
import chatModel from "../model/chat";

const roomRouter = express();

//get room list
roomRouter.get("/room", async (req, res) => {
  const {
    params: { id }
  } = req;
  console.log(req.params);
  try {
    //const user = await userModel.findOne({ email: id }).populate("rooms");
    //console.log(user.rooms);
    const room = await roomModel.find();
    res.status(200).json(room);
  } catch (error) {
    res.status(400).end();
  }
});
//create room
roomRouter.post("/room", async (req, res) => {
  const {
    body: { id, title, type }
  } = req;
  try {
    const user = await userModel.findOne({ email: id });
    const newRoom = await roomModel.create({ title, type });
    newRoom.participants.push(user.id);
    user.rooms.push(newRoom.id);
    newRoom.save();
    user.save();
    res.status(200).json(newRoom);
  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
});
roomRouter.get("/:id/chat", async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const chat = await chatModel.find({ room: id }).populate("sender");
    //console.log("???");
    console.log(chat);
    res.status(200).json(chat);
  } catch (error) {
    res.status(400).end();
  }
});
roomRouter.post("/:id/chat", async (req, res) => {
  const {
    params: { id },
    body: { name, msg }
  } = req;
  //console.log(name, msg);
  try {
    const room = await roomModel.findById(id).populate("participants");
    let uid = null;
    for (const iter of room.participants) {
      if (iter.email === name) {
        uid = iter._id;
        break;
      }
    }
    const chat = await chatModel.create({
      sender: uid,
      msg,
      room: room._id
    });
    chat.save();
    res.status(200).end();
  } catch (error) {
    res.status(400).end();
  }
});
roomRouter.post("/:id/join", async (req, res) => {
  const {
    params: { id },
    body: { name }
  } = req;
  console.log(id);
  try {
    const room = await roomModel.findById(id).populate("participants");
    const user = await userModel.findOne({ email: name });
    let idx = -1;
    for (let i = 0; i < room.participants.length; i++) {
      if (room.participants[i].email === name) {
        idx = i;
        break;
      }
    }
    console.log(room);
    console.log(idx);
    if (idx === -1) {
      room.participants.push(user.id);
      room.save();
    }
    res.status(200).end();
  } catch (error) {
    res.status(400).end();
  }
});
roomRouter.post("/:id/left", async (req, res) => {
  const {
    params: { id },
    body: { name }
  } = req;
  try {
    const room = await roomModel.findById(id);
    let idx = -1;
    for (let i = 0; i < room.participants.length; i++) {
      if (room.participants[i].email === name) {
        idx = i;
        break;
      }
    }
    if (idx !== -1) {
      room.participants.splice(idx, 1);
      room.save();
    }
    res.status(200).end();
  } catch (error) {
    res.status(400).end();
  }
});
export default roomRouter;
