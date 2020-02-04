import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: { type: String, require: "email require" },
  password: { type: String, require: " password require" },
  friends: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  ],
  avatarUrl: {
    type: String
  },
  rooms: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Room"
    }
  ],
  register_date: { type: Date, default: Date.now() }
});
const userModel = mongoose.model("User", userSchema);
export default userModel;
