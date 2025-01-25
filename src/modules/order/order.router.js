import { Router } from "express";
import * as orderController from "./controller/order.controller.js";
import {
  createOrderSchema,
  getAndDeleteSchema,
  headersSchema,
  updateOrderSchema,
} from "./controller/order.validation.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";
const router = Router();

//add order
router.post(
  "/addOrder",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin", "user"]),
  isValid(createOrderSchema),
  orderController.addOrder
);

//update order
router.patch(
  "/updateOrder/:orderId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin", "user"]),
  isValid(updateOrderSchema),
  orderController.updateOrder
);

//delete product
router.delete(
  "/deleteOrder/:orderId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin"]),
  isValid(getAndDeleteSchema),
  orderController.deleteOrder
);

//get all orders
router.get(
  "/allOrders",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin", "user"]),
  orderController.allOrders
);

//get sp order
router.get(
  "/getOrder/:orderId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin", "user"]),
  isValid(getAndDeleteSchema),
  orderController.getOrder
);
export default router;
