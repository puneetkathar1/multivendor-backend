import express from "express";
import { authRouter } from "./resources/auth";
import { productRouter } from "./resources/product";
import { vendorRouter } from "./resources/vendor";
import { sellerRouter } from "./resources/seller";
import { categoryRouter } from "./resources/category";
import { locationRouter } from "./resources/location";
import { customerRouter } from "./resources/customer";
import { orderRouter } from "./resources/order";
import { businessRouter } from "./resources/business";
import { findVendorWithLowestPrice } from "../utils";

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
