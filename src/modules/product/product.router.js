import Router from "express";
import * as productController from "./controller/product.controller.js";
import { createProductSchema, getAndDeleteSchema, headersSchema, updateProductSchema } from "./controller/product.validation.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router({ mergeParams: true });

//create product
router.post(
  "/addProduct/:categoryId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin"]),
  isValid(createProductSchema),
  productController.addProduct
);

//update product
router.patch(
  "/updateProduct/:productId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin"]),
  isValid(updateProductSchema),
  productController.updateProduct
);


//delete product
router.delete(
  "/deleteProduct/:productId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin"]),
  isValid(getAndDeleteSchema),
  productController.deleteProduct
);

//get all products
router.get(
  "/allProducts",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin" ,"user"]),
  productController.allProducts
);

//get sp product
router.get(
  "/getProduct/:productId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin","user"]),
  isValid(getAndDeleteSchema),
    productController.getProduct
);


export default router;
