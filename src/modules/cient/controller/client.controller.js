import clientModel from "../../../../DB/models/Client.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

//add client
export const addClient = asyncHandler(async (req, res, next) => {
  const { name, phone, notes } = req.body;
  const existClient = await clientModel.findOne({ name });
  if (existClient) {
    return next(new Error("Name already exists", { cause: 401 }));
  }
  const createClient = await clientModel.create({
    name,
    phone,
    notes,
  });
  return res.status(201).json({
    message: "Client added successfully.",
    user: createClient._id,
  });
});
//====================================================================================================================//
//update client

export const updateClient = asyncHandler(async (req, res, next) => {
  const { clientId } = req.params;
  const { name, phone, notes } = req.body;
  const existClient = await clientModel.findById(clientId);
  if (!existClient) {
    return next(new Error("In-valid client ID.", { cause: 400 }));
  }
  if (!(name || phone || notes)) {
    return next(new Error("We need information to update", { cause: 400 }));
  }
  if (name || phone || notes) {
    const object = { ...req.body };
    for (let key in object) {
      if (user[key] == object[key]) {
        return next(
          new Error(
            `Cannot update ${key} with the same value. Please provide a different value.`,
            { cause: 400 }
          )
        );
      }
    }
  }
  if (name) {
    const checkUniqueName = await clientModel.findOne({ name });
    if (checkUniqueName) {
      if (checkUniqueName.name === name) {
        return next(
          new Error("The name you have chosen is already taken.", {
            cause: 409,
          })
        );
      }
    }
  }

  const updateClient = await clientModel.findByIdAndUpdate(clientId, req.body, {
    new: true,
  });
  return res.status(200).json({
    status: "success",
    message: "Client updated successfully.",
    result: updateClient,
  });
});
//====================================================================================================================//
//delete client

export const deleteClient = asyncHandler(async (req, res, next) => {
  const client = await clientModel.findByIdAndDelete(req.params.clientId);
  if (!client) {
    return next(new Error("client not found", { cause: 404 }));
  }
  return res
    .status(200)
    .json({ message: "client deleted successfully", result: client });
});

//====================================================================================================================//
//get all clients

export const allClients = asyncHandler(async (req, res, next) => {
  const allClients = await clientModel.find();
  if (!allClients.length) {
    return res.status(404).json({
      status: "failure",
      message: "No clients found!",
    });
  }
  return res.status(200).json({
    status: "success",
    message: "All clients!",
    count: allClients.length,
    result: allClients,
  });
});
//====================================================================================================================//
//get sp client

export const getClient = asyncHandler(async (req, res, next) => {
  const { clientId } = req.params;
  const client = await clientModel.findById(clientId);
  if (!client) {
    return next(new Error("Invalid client ID.", { cause: 400 }));
  }
  return res.status(200).json({
    status: "success",
    message: "Done!",
    result: client,
  });
});
