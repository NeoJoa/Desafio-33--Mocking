import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin.js";
import * as usersController from "../controller/users.controller.js";

const router = Router();

router.post("/", usersController.post);

router.get("/", usersController.getAll);

router.get("/by?", usersController.getBy);

router.put("/by?", usersController.putBy);

router.delete("/by?", usersController.deleteBy);

export default router;
