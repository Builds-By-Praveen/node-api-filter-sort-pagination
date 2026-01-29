import express from "express";

import { ListItems } from "../controllers/items.controller.js";
import {
  ManualValidateQuery,
  ZodValidateQuery,
} from "../middlewares/validation.middlware.js";

const router = express.Router();

// router.get("/items", ManualValidateQuery, ListItems); // Manual Validation
router.get("/items", ZodValidateQuery, ListItems); // Zod Validation

export default router;
