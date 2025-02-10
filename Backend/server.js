const express = require("express");
const app = express();
const socketio = require("socket.io");
const http = require("http");
const Server = socketio.Server;
const cors = require("cors");
const db = require("./database");
const document = require("./schema");
const server = http.createServer(app);
app.get("/", (req, res) => {
  res.send("hello");
});
const corsOption = {
  origin: "https://gilded-sherbet-4bea21.netlify.app",
  methods: ["GET", "POST"],
  credentials: true,
};
const io = new Server(server, {
  cors: corsOption,
});
app.use(cors(corsOption));
io.on("connection", (socket) => {
  console.log("connection");
  socket.on("get-document", async(id) => {
    const inserted= await findOrCreate(id);
    socket.join(id);
    socket.emit("load-document", inserted.data);
    socket.on("send-change", (delta) => {
      socket.broadcast.to(id).emit("receive-changes", delta);
    });
    socket.on("save-document",async (doc)=>{
       const update=await document.findByIdAndUpdate(id,{data:doc});
    });
  });
});
const findOrCreate = async (id) => {
  if (!id) return;
  const findAns = await document.findById(id);
  if (findAns) return findAns;
  return document.create({ _id: id, data: "" });
};
server.listen(3000, () => {
  console.log("server started");
});
