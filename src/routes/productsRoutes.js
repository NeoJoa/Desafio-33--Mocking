import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isUser } from "../middlewares/isUser.js";
import * as productsController from "../controller/products.controller.js";

const router = Router();

router.post("/", productsController.post);

router.get("/?", productsController.getAll);

router.get("/:pid", productsController.getById);

router.put("/:pid", productsController.putById);

router.delete("/:pid", productsController.deleteById);

export default router;
