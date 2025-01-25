import categoryModel from "../../../../DB/models/Category.model.js";
import productModel from "../../../../DB/models/Product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

//add product to store

export const addProduct = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const { name, quantitiy } = req.body;

  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new Error("In-valid category ID.", { cause: 400 }));
  }
  const product = await productModel.create({
    name,
    quantitiy,
    categoryId,
    createdBy: req.user._id,
  });
  category.products.push(product._id)
  await category.save()
  return res.status(201).json({
    message: "Product added successfully.",
    product,
  });
});
//====================================================================================================================//
//update product

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { name, quantitiy } = req.body;

  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error("In-valid product ID.", { cause: 400 }));
  }

  if (!(name || quantitiy)) {
    return next(new Error("We need information to update", { cause: 400 }));
  }
  if (name || quantitiy) {
    const object = { ...req.body };
    for (let key in object) {
      if (product[key] == object[key]) {
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
  const updatedProduct = await productModel.findByIdAndUpdate(
    productId,
    req.body,
    { new: true }
  );

  return res.status(200).json({
    status: "success",
    message: "Product updated successfully.",
    result: updatedProduct,
  });
});
//====================================================================================================================//
//delete product

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await productModel.findByIdAndDelete(productId);
  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  return res
    .status(200)
    .json({ message: "Product deleted successfully", result: product });
});

//====================================================================================================================//
//get all Products

export const allProducts = asyncHandler(async (req, res, next) => {
  const allProducts = await productModel.find();
  if (!allProducts.length) {
    return res.status(404).json({
      status: "failure",
      message: "No Products found!",
    });
  }
  return res.status(200).json({
    status: "success",
    message: "All Products!",
    count: allProducts.length,
    result: allProducts,
  });
});
//====================================================================================================================//
//get sp product

export const getProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error("Invalid product ID.", { cause: 400 }));
  }
  return res.status(200).json({
    status: "success",
    message: "Done!",
    result: product,
  });
});
