import { Router } from "express";
import * as mockingController from "../controller/mockingProducts.controller.js";

const router = Router();

router.get("/", mockingController.get);

export default router;
