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
};

let chatMesssageFormat = {
  role: "chat",
  message: "",
  id: "",
};

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

  chatMesssageFormat.message = data.message;
  chatMesssageFormat.id = new Date().getUTCMilliseconds();

  io.emit("chatSocket", chatMesssageFormat);

  res.json("The bot message was sended successfully");

  chatMesssageFormat.message = "";
  chatMesssageFormat.id = "";
});

app.post("/userMessage", cors(), async (req, res) => {
  const data = req.body;

  console.log(data);
  console.log(data.message);
  userMesssageFormat.message = data.message;
  userMesssageFormat.id = new Date().getUTCMilliseconds();

  io.emit("userSocket", userMesssageFormat);

  res.json("The user message was sended successfully");

  userMesssageFormat.message = "";
  userMesssageFormat.id = "";
});

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
