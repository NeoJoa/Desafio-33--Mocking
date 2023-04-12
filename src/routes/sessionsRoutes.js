import { Router } from "express";
import passport from "passport";
import userModel from "../dao/models/users.model.js";
import jwt from "jsonwebtoken";
import { passportCallback } from "../utils.js";
import config from "../config/config.js";
import ClientUser from "../dao/DTOs/ClientUser.js";
import { isUser } from "../middlewares/isUser.js";
import { CartsService, UsersService } from "../dao/repositories/index.js";

const router = Router();

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    res.redirect("/");
  }
);

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "failRegister",
    passReqToCallback: true,
    session: false,
  }),
  (req, res) => {
    return res.send({
      status: "success",
      message: "User registered",
      payload: req.user._id,
    });
  }
);

router.get("/failRegister", (req, res) => {
  res.send({ error: "Fail register" });
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "failLogin",
    session: false,
  }),
  async (req, res) => {
    const token = jwt.sign(req.user, config.cookieSecret, {
      expiresIn: "1h",
    });
    res.cookie("coderCookieToken", token, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
    });
    res.send({
      status: "success",
      message: "Login success",
      payload: req.user,
    });
  }
);

router.get("/failLogin", passportCallback("login"), async (req, res) => {
  res.send({ error: "Fail login" });
});

router.post("/logout", isUser, async (req, res) => {
  const cartId = req.user.cartId;
  const deleteCartResponse = await CartsService.deleteById(cartId);
  if (deleteCartResponse.error)
    return res.status(deleteCartResponse.status).send(deleteCartResponse);
  const userUpdateResponse = await UsersService.putBy(
    { id: req.user.id },
    { cartId: [] }
  );
  if (userUpdateResponse.error)
    return res.status(userUpdateResponse.status).send(userUpdateResponse);
  res.clearCookie("coderCookieToken").send({ message: "Logout success" });
});

router.post("/recover", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send({ status: 404, error: "Incomplete values" });
  await userModel.findOneAndUpdate(
    { email: email },
    { password: createHash(password) }
  );
  res.send({ status: "success", message: "Password updated" });
});

router.get("/current", passportCallback("jwt"), (req, res) => {
  const user = new ClientUser(req.user);
  res.send(user);
});

export default router;
