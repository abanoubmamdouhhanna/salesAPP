import categoryModel from "../../../../DB/models/Category.model.js";
import productModel from "../../../../DB/models/Product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

//create category
export const addCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  const category = await categoryModel.create({
    name,
    description,
    createdBy: req.user._id,
  });
  return res.status(201).json({
    message: "Category added successfully.",
    category,
  });
});
//====================================================================================================================//
//update category

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;

  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new Error("In-valid category ID.", { cause: 400 }));
  }

  if (!(name || description)) {
    return next(new Error("We need information to update", { cause: 400 }));
  }
  if (name || description) {
    const object = { ...req.body };
    for (let key in object) {
      if (category[key] == object[key]) {
        return next(
          new Error(
            `Cannot update ${key} with the same value. Please provide a different value.`,
            { cause: 400 }
          )
        );
      }
    }
  }
  req.body.updatedBy = req.user._id;
  const updatedCategory = await categoryModel.findByIdAndUpdate(
    categoryId,
    req.body,
    { new: true }
  );

  return res.status(200).json({
    status: "success",
    message: "Category updated successfully.",
    result: updatedCategory,
  });
});
//====================================================================================================================//
//delete category

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await categoryModel.findByIdAndDelete(categoryId);
  if (!category) {
    return next(new Error("category not found", { cause: 404 }));
  }
  await productModel.deleteMany({ categoryId });

  return res
    .status(200)
    .json({
      message: "category and associated products deleted successfully",
      result: category,
    });
});
//====================================================================================================================//
//get all categories

export const allCategories = asyncHandler(async (req, res, next) => {
  const allCategories = await categoryModel.find();
  if (!allCategories.length) {
    return res.status(404).json({
      status: "failure",
      message: "No Categories found!",
    });
  }
  return res.status(200).json({
    status: "success",
    message: "All Categories!",
    count: allCategories.length,
    result: allCategories,
  });
});
//====================================================================================================================//
//get sp category

export const getCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new Error("Invalid category ID.", { cause: 400 }));
  }
  return res.status(200).json({
    status: "success",
    message: "Done!",
    result: category,
  });
});
