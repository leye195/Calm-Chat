import mongoose from "mongoose";
const Schema = mongoose.Schema;
const chatSchema = new Schema({
  msg: { type: String, required: "contents required" },
  sender: { type: mongoose.Types.ObjectId, ref: "User" },
  room: {
    type: mongoose.Types.ObjectId,
    ref: "Room"
  },
  register_date: { type: Date, default: Date.now() }
});
const chatModel = mongoose.model("Chat", chatSchema);
export default chatModel;
