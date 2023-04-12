import { Router } from "express";
import { isUser } from "../middlewares/isUser.js";
import { ProductsService, CartsService } from "../dao/repositories/index.js";

const router = Router();

router.get("/", async (req, res) => {
  const isLogin = req.cookies["coderCookieToken"] ? true : false;
  res.render("home", { isLogin });
});

router.get("/chat", isUser, async (req, res) => {
  const isLogin = req.cookies["coderCookieToken"] ? true : false;
  res.render("chat", { isLogin });
});

router.get("/products?", async (req, res) => {
  const isLogin = req.cookies["coderCookieToken"] ? true : false;
  const user = req.user;
  const { query, limit, page, sort } = req.query;
  const response = await ProductsService.getAll(query, limit, page, sort);
  let {
    payload,
    hasNextPage,
    hasPrevPage,
    nextLink,
    prevLink,
    page: resPage,
  } = response;
  if (hasNextPage)
    nextLink = `http://localhost:8080/products/?${
      query ? "query=" + query + "&" : ""
    }${"limit=" + limit}${"&page=" + (+resPage + 1)}${
      sort ? "&sort=" + sort : ""
    }`;
  if (hasPrevPage)
    prevLink = `http://localhost:8080/products/?${
      query ? "query=" + query + "&" : ""
    }${"limit=" + limit}${"&page=" + (+resPage - 1)}${
      sort ? "&sort=" + sort : ""
    }`;
  return res.render("products", {
    payload,
    hasNextPage,
    hasPrevPage,
    nextLink,
    prevLink,
    resPage,
    isLogin,
    user,
  });
});

router.get("/cart", isUser, async (req, res) => {
  const id = req.user.cartId;
  const cart = await CartsService.getById(id);
  if (cart.error) return res.status(cart.error).send(cart);
  return res.render("cart", { cart, isLogin: true });
});

router.get("/register", (req, res) => {
  return res.render("register", {});
});

router.get("/login", (req, res) => {
  return res.render("login", {});
});

router.get("/recover", (req, res) => {
  return res.render("recoverPassword", {});
});

router.get("/profile", isUser, (req, res) => {
  return res.render("profile", { isLogin: true });
});

export default router;
