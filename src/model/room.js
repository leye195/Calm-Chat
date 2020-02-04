import mongoose from "mongoose";
const Schema = mongoose.Schema;
const roomSchema = new Schema({
  title: String,
  type: String, //group or personal
  participants: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  ],
  chatting: {
    type: mongoose.Types.ObjectId,
    ref: "Chat"
  },
  register_date: { type: Date, default: Date.now() }
});
const roomModel = mongoose.model("Room", roomSchema);
export default roomModel;
