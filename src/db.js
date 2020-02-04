import mongoose from "mongoose";
const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
  console.log("Connected to mongodb server");
});
mongoose.connect(`mongodb://localhost/socIO`);
