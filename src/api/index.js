import express from "express";
import { authRouter } from "./resources/auth/index.js";
import { productRouter } from "./resources/product/index.js";
import { vendorRouter } from "./resources/vendor/index.js";
import { sellerRouter } from "./resources/seller/index.js";
import { categoryRouter } from "./resources/category/index.js";
import { locationRouter } from "./resources/location/index.js";
import { customerRouter } from "./resources/customer/index.js";
import { orderRouter } from "./resources/order/index.js";
import { businessRouter } from "./resources/business/index.js";
import { findVendorWithLowestPrice } from "../utils/index.js";

export const restRouter = express.Router();
restRouter.use("/auth", authRouter);
restRouter.use("/customer", customerRouter);
restRouter.use("/location", locationRouter);
restRouter.use("/product", productRouter);
restRouter.use("/vendor", vendorRouter);
restRouter.use("/seller", sellerRouter);
restRouter.use("/category", categoryRouter);
restRouter.use("/order", orderRouter);
restRouter.use("/business", businessRouter);

restRouter.get("/vendorMin", function (req, res) {
  const productId = req.query.productId;
  findVendorWithLowestPrice(productId)
    .then(({ vendor }) => {
      res.status(200).send({ vendor });
    })
    .catch((err) => {
      console.log({ err });
      res.status(500).send({ err });
    });
});
