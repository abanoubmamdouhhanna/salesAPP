import Router from "express";
import * as clientController from "./controller/client.controller.js";
import {
  createClientSchema,
  getAndDeleteSchema,
  headersSchema,
  updateClientSchema,
} from "./controller/client.validation.js";
import { isValid } from "../../middlewares/validation.middleware.js";

const router = Router();

//add new client
router.post(
  "/addClient",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin"]),
  isValid(createClientSchema),
  clientController.addClient
);

//update client
router.post(
  "/updateClient/:clientId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin"]),
  isValid(updateClientSchema),
  clientController.updateClient
);

//delete client
router.delete(
  "/deleteClient/:clientId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin"]),
  isValid(getAndDeleteSchema),
  clientController.deleteClient
);

//get all client
router.get(
  "/allClients",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin"]),
  clientController.allClients
);

//get sp client
router.get(
  "/getClient/:clientId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin"]),
  isValid(getAndDeleteSchema),
  userController.getClient
);

export default router;
