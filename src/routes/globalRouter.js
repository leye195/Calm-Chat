import express, { response } from "express";
import path from "path";
import User from "../model/user";
import Room from "../model/room";
import Chat from "../model/chat";
const globalRouter = express.Router();
//get: user information,login Get Request
globalRouter.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/../static/html/index.html"));
});
globalRouter.get("/chats", (req, res) => {
  res.sendFile(path.join(__dirname + "/../static/html/chats.html"));
});
globalRouter.get("/more", (req, res) => {
  res.sendFile(path.join(__dirname + "/../static/html/more.html"));
});
globalRouter.get("/group/:room_name", (req, res) => {
  res.sendFile(path.join(__dirname + "/../static/html/chat.html"));
});

globalRouter.get("/chat/:user_name", (req, res) => {
  res.sendFile(path.join(__dirname + "/../static/html/chat.html"));
});
globalRouter.get("/login", async (req, res) => {
  const {
    query: { email, pwd }
  } = req;
  try {
    const user = await User.findOne({ email: email, password: pwd });
    res.status(200).json({ error: 0, success: 1, result: user });
  } catch (error) {
    res.status(400).end();
  }
});
//post: User SignUp Post Request
globalRouter.post("/signup", async (req, res) => {
  const {
    body: { email, pwd }
  } = req;
  await User.find({ email: email, password: pwd }, (err, data) => {
    if (err) res.status(500).json({ error: 1, msg: "DB Error" });
    if (data.length !== 0) {
      res.json({ error: 2, msg: "User Already Exists" });
    }
    if (data.length === 0) {
      const user = new User({
        email: email,
        password: pwd
      });
      user.save(err => {
        if (err) res.json({ error: 3, msg: "Error occured while saving data" });
        else res.json({ error: 0, success: 1, msg: "SignUp Success" });
      });
    }
  });
});
//get: user's friend list
globalRouter.get("/friend_list/:user_id", async (req, res) => {
  const {
    params: { user_id }
  } = req;
  //console.log(user_id);
  try {
    const user = await User.findOne({ email: user_id }).populate("friends");
    //console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).end();
  }
});
//get: find User id to add friend
globalRouter.get("/friend/:user_id", async (req, res) => {
  const { user_id } = req.params;
  await User.findOne({ email: user_id }, (err, data) => {
    if (err) res.status(500).json({ error: 1, msg: "DB Error" });
    if (data === null) {
      res.json({ error: 2, msg: "User does not exists" });
    } else {
      res.json({ error: 0, success: 1, result: data });
    }
  });
});
//post: add to friend list
globalRouter.post("/add_friend", async (req, res) => {
  const {
    body: { my, email }
  } = req;
  console.log("???");
  try {
    const user = await User.findOne({ email: my });
    const friend = await User.findOne({ email });
    console.log(user);
    if (user.friends.indexOf(friend.id) === -1) {
      user.friends.push(friend.id);
      user.save();
    }
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
});
export default globalRouter;
