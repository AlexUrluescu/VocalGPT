import express from "express";
import http from "http";

import { Server } from "socket.io";
import cors from "cors";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let userMesssageFormat = {
  role: "user",
  message: "",
  id: "",
  time: ""
};

let chatMesssageFormat = {
  role: "chat",
  message: "",
  id: "",
  time: ""
};

const addZero = (i) => {
  if (i < 10) {i = "0" + i}
  return i;
}

const PORT = 5000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

io.on("connection", (socket) => {
  socket.emit("userSocket", userMesssageFormat);

  socket.emit("chatSocket", chatMesssageFormat);
});

app.get("/chat", cors(), async (req, res) => {
  res.json("Chat");
});

app.post("/botMessage", cors(), async (req, res) => {
  const data = req.body;
  console.log(data);
  console.log(data.message);

  let date = new Date();
  let hour = addZero(date.getHours());
  let minut = addZero(date.getMinutes());

  let time = hour + ":" + minut;

  chatMesssageFormat.message = data.message;
  chatMesssageFormat.id = new Date().getUTCMilliseconds();
  chatMesssageFormat.time = time

  io.emit("chatSocket", chatMesssageFormat);

  res.json("The bot message was sended successfully");

  chatMesssageFormat.message = "";
  chatMesssageFormat.id = "";
});

app.post("/userMessage", cors(), async (req, res) => {
  const data = req.body;

  let date = new Date();
  let hour = addZero(date.getHours());
  let minut = addZero(date.getMinutes());

  let time = hour + ":" + minut;

  console.log(data);
  console.log(data.message);
  userMesssageFormat.message = data.message;
  userMesssageFormat.id = new Date().getUTCMilliseconds();
  userMesssageFormat.time = time

  io.emit("userSocket", userMesssageFormat);

  res.json("The user message was sended successfully");

  userMesssageFormat.message = "";
  userMesssageFormat.id = "";
});

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
