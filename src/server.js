import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import socketIO from "socket.io";
import globalRouter from "./routes/globalRouter";
import socketEvent from "./socket";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import "./db";
import roomRouter from "./routes/roomRouter";
dotenv.config();
const app = express();
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(helmet());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/", globalRouter);
app.use("/rooms", roomRouter);
//io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });
// This will emit the event to all connected sockets

//socket.join()으로 room 접속, socket.leave()으로 room 나감, io.to() 특정 room에 이벤트 보내기
//io.to("").emit("");
const server = app.listen(process.env.PORT, () =>
  console.log(`Connected to ${process.env.PORT}`)
);
const io = socketIO(server);
socketEvent(io);
