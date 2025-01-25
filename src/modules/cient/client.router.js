import Router from "express";
import * as clientController from "./controller/client.controller.js";
import {
  createClientSchema,
  getAndDeleteSchema,
  headersSchema,
  updateClientSchema,
} from "./controller/client.validation.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { auth } from "../../Middlewares/auth.middleware.js";

const router = Router();

//add new client
router.post(
  "/addClient",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin" ,"user"]),
  isValid(createClientSchema),
  clientController.addClient
);

//update client
router.post(
  "/updateClient/:clientId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin" ,"user"]),
  isValid(updateClientSchema),
  clientController.updateClient
);

//delete client
router.delete(
  "/deleteClient/:clientId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin" ,"user"]),
  isValid(getAndDeleteSchema),
  clientController.deleteClient
);

//get all client
router.get(
  "/allClients",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin" ,"user"]),
  clientController.allClients
);

//get sp client
router.get(
  "/getClient/:clientId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin","user"]),
  isValid(getAndDeleteSchema),
  clientController.getClient
);

export default router;
