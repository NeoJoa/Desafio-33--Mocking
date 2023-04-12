import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import cookieParser from "cookie-parser";
import viewsRouter from "./routes/viewsRoutes.js";
import sessionRouter from "./routes/sessionsRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import cartsRoutes from "./routes/cartsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import messageModel from "./dao/models/messages.model.js";
import passport from "passport";
import initPassport from "./config/passportConfig.js";
import config from "./config/config.js";

const app = express();

const httpServer = app.listen(config.port, () =>
  console.log("App listen on port", config.port)
);

const io = new Server(httpServer);

app.engine("handlebars", handlebars.engine());

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

initPassport();
app.use(passport.initialize());

app.use("/", viewsRouter);
app.use("/api/session", sessionRouter);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/api/users", usersRoutes);

async function getLogs() {
  return await messageModel.find();
}

io.on("connection", async (socket) => {
  console.log("New client connected");

  const logs = await getLogs();
  io.emit("log", { logs });
  socket.on("message", async (data) => {
    await messageModel.create({
      user: data.user,
      message: data.message,
      time: data.time,
    });
    const logs = await getLogs();
    io.emit("log", { logs });
  });
  socket.on("userAuth", (data) => {
    socket.broadcast.emit("newUser", data);
  });
});
