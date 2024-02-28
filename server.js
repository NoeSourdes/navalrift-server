const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://navalrift.vercel.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join_groups", (groups) => {
    groups.forEach((group) => {
      socket.join(group);
      console.log(`L'utilisateur ${socket.id} a rejoint le groupe : ${group}`);
    });
  });

  socket.on("send_msg", (data) => {
    console.log(data, "DATA");
    socket.to(data.id_group).emit("receive_msg", data);
    socket.to(data.id_group).emit("notification", {
      message:
        "Nouveau message reçu de " +
        data.name_user +
        " dans le groupe " +
        data.name_group,
    });
  });

  socket.on("disconnect", () => {
    console.log("utilisateur déconnecté", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {});
