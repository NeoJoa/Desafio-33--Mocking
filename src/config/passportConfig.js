import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { createHash, isCorrect } from "../utils.js";
import githubService from "passport-github2";
import { CartsService, UsersService } from "../dao/repositories/index.js";
import nodemailer from "nodemailer";
import cartModel from "../dao/models/carts.model.js";

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 5087,
  auth: {
    user: "joaquinaquino999@gmail.com",
    pass: "cyjmsqaoicdgvxzx",
  },
});

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["coderCookieToken"];
  }
  return token;
};

const initPassport = () => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "coderSecret",
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload, {
            message: "Mensaje de prueba para probar los errores personalizados",
          });
        } catch (error) {
          return done(error, false, { message: "Mensaje de ERROR de prueba" });
        }
      }
    )
  );

  passport.use(
    "github",
    new githubService(
      {
        clientID: "Iv1.f404a03d79d38515",
        clientSecret: "266d2064da8d10c6ffccb3e18543d80618d3f255",
        callbackURL: "http://localhost:8080/api/session/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await UsersService.getBy({
            email: profile._json.email,
          });
          if (!user) {
            const newUser = {
              firstName: profile._json.name,
              lastName: "",
              email: profile._json.email,
              password: "",
            };
            const result = await UsersService.post(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        const { firstName, lastName, age } = req.body;
        try {
          const exist = await UsersService.getBy({ email });
          if (exist) {
            return done(null, false, { message: "The user already exist" });
          }
          const newUser = {
            firstName,
            lastName,
            age,
            cartId: undefined,
            email,
            password: createHash(password),
          };

          await transport.sendMail({
            from: "joaquinaquino999@gmail.com",
            to: `${email}`,
            subject: "Email de prueba desde servidor backend",
            text: `Usuario registrado correctamente. \n Credenciales: Email:${email} Password: ${password}`,
          });

          const result = await UsersService.post(newUser);
          return done(null, result, { message: "User created successfully" });
        } catch (error) {
          return done("Error getting user" + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", session: false },
      async (email, password, done) => {
        try {
          if (
            email === "adminCoder@coder.com" &&
            password === "adminCod3r123"
          ) {
            const postCartResponse = await CartsService.post();
            if (postCartResponse.error)
              return done(null, false, { message: "Cart creation failed" });
            const cartId = postCartResponse.id;
            const user = {
              email,
              password,
              cartId,
              role: "admin",
            };
            return done(null, user);
          }
          let user = await UsersService.getBy({ email });
          if (!user) {
            return done(null, false, { message: "Email not registered" });
          }
          if (!isCorrect(user, password))
            return done(null, false, { message: "Incorrect password" });
          const postCartResponse = await CartsService.post();
          if (postCartResponse.error)
            return done(null, false, { message: "Cart creation failed" });
          const cartId = postCartResponse.id;
          user.cartId = cartId;
          const updateUserResponse = await UsersService.putBy(
            { email },
            { cartId: cartId }
          );
          if (updateUserResponse.error)
            return done(null, false, { message: "Failed update user" });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UsersService.getBy({ _id: id });
    done(null, user);
  });
};

export default initPassport;
