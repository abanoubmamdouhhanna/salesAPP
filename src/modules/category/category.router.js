import Router from "express";
import * as categoryController from "./controller/category.controller.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";
import productRouter from '../product/product.router.js'
import { createCategorySchema, getAndDeleteSchema, headersSchema, updateCategorySchema } from "./controller/category.validation.js";

const router = Router();

//product router
router.use("/product",productRouter)

//create category
router.post(
  "/addCategory",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin"]),
  isValid(createCategorySchema),
  categoryController.addCategory
);

//update category
router.patch(
  "/updateCategory/:categoryId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin"]),
  isValid(updateCategorySchema),
  categoryController.updateCategory
);

//delete category
router.delete(
  "/deleteCategory/:categoryId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin"]),
  isValid(getAndDeleteSchema),
  categoryController.deleteCategory
);

//get all categories
router.get(
  "/allCategories",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin", "user"]),
  categoryController.allCategories
);

//get sp category
router.get(
  "/getCategory/:categoryId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin", "user"]),
  isValid(getAndDeleteSchema),
  categoryController.getCategory
);


export default router;
