import express from "express";
import path from "path";
const globalRouter = express.Router();
//get: user information,login Get Request
globalRouter.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/../static/html/index.html"));
});
export default globalRouter;
