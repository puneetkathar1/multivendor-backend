import { db } from "../../../models";
import config from "../../../config";
import AWS from "aws-sdk";
const { Op, where } = require("sequelize");
var Util = require("../../../helpers/Util");

const s3 = new AWS.S3({
  accessKeyId: config.app.AWS_ACCESS_KEY,
  secretAccessKey: config.app.AWS_SECRET_KEY,
});

var deleteFileFromS3 = async (imgUrl) => {
  try {
    const lastItem = imgUrl.substring(imgUrl.lastIndexOf("/") + 1);
    var params = {
      Bucket: "grociproduct",
      Key: lastItem,
    };
    s3.deleteObject(params, (error, data) => {
      if (error) {
        console.log(error, error.stack);
      }
      return data;
    });
  } catch (error) {
    throw new RequestError(error);
  }
};
const convertToSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};
export default {
  async createProduct(req, res, next) {
    try {
      const {
        categoryId,
        subCategoryId,
        childCategoryId,
        LocalDeiveryCharge,
        ZonalDeiveryCharge,
        NationalDeiveryCharge,
        warrantyType,
        warrantyPeriod,
        ShippingDays,
        SpecificationDetails,
        priceDetails,
        HighLightDetais,
      } = req.body;
      db.user
        .findOne({
          where: { email: req.user.email, role: req.user.role },
        })
        .then(async (user) => {
          if (user) {
            const t = await db.sequelize.transaction();
            try {
              const productCreated = await db.product.create(
                {
                  categoryId: categoryId,
                  subCategoryId: subCategoryId,
                  childCategoryId: childCategoryId,
                  SellerId: req.user.id,
                  status: "inactive",
                  LocalDeiveryCharge: LocalDeiveryCharge,
                  ZonalDeiveryCharge: ZonalDeiveryCharge,
                  NationalDeiveryCharge: NationalDeiveryCharge,
                  WarrantyType: warrantyType,
                  WarrantyPeriod: warrantyPeriod,
                  ShippingDays: ShippingDays,
                  HighLightDetail: HighLightDetais,
                },
                { transaction: t }
              );

              const featureList = [];
              for (var i = 0; i < SpecificationDetails.length; i++) {
                featureList.push({
                  productId: productCreated.id,
                  type: SpecificationDetails[i].type,
                  value: SpecificationDetails[i].value,
                });
              }
              if (featureList.length)
                await db.ch_specification.bulkCreate(featureList, {
                  transaction: t,
                });

              let priceEntries = [];
              for (var i = 0; i < priceDetails.length; i++) {
                const marginPrice = Math.round(
                  priceDetails[i].distributorPrice - priceDetails[i].buyerPrice
                );
                const marginPer = Math.round(
                  ((priceDetails[i].distributorPrice -
                    priceDetails[i].buyerPrice) /
                    priceDetails[i].distributorPrice) *
                    100
                );
                const discountPer = Math.round(
                  ((priceDetails[i].distributorPrice -
                    priceDetails[i].buyerPrice) /
                    priceDetails[i].distributorPrice) *
                    100
                );
                const discount = Math.round(
                  priceDetails[i].distributorPrice - priceDetails[i].buyerPrice
                );
                const total = Math.round(priceDetails[i].buyerPrice);
                const netPrice = Math.round(priceDetails[i].buyerPrice);

                priceEntries.push({
                  productId: productCreated.id,
                  productName: priceDetails[i].productName,
                  slug: convertToSlug(priceDetails[i].productName),
                  productCode: priceDetails[i].productCode
                    ? priceDetails[i].productCode
                    : "PD" + Math.random().toString(36).substr(2, 4),
                  longDesc: priceDetails[i].longDesc,
                  shortDesc: priceDetails[i].shortDesc,
                  distributorPrice: priceDetails[i].distributorPrice
                    ? priceDetails[i].distributorPrice
                    : null,
                  buyerPrice: priceDetails[i].buyerPrice
                    ? priceDetails[i].buyerPrice
                    : null,
                  marginPrice: marginPrice,
                  marginPer: marginPer,
                  discount: discount,
                  discountPer: discountPer,
                  total: total,
                  netPrice: netPrice,
                  unitSize: priceDetails[i].unitSize,
                  qty: priceDetails[i].qty,
                  colorId: priceDetails[i].colorId,
                  brandId: priceDetails[i].brandId,
                  youTubeUrl: priceDetails[i].youTubeUrl,
                  stockType: priceDetails[i].stockType,
                  refundable: priceDetails[i].REFUNDABLE,
                  qtyWarning: priceDetails[i].QTYWARNING,
                  COD: priceDetails[i].COD,
                });
              }
              if (priceEntries.length)
                await db.ProductVariant.bulkCreate(priceEntries, {
                  transaction: t,
                });

              return t.commit();
            } catch (error) {
              console.log(error);
              await t.rollback();
              throw new RequestError(error, 500);
            }
          }
          throw new RequestError("User not found", 500);
        })

        .then((product) => {
          res.status(200).json({
            status: 201,
            success: true,
            message: "Successfully inserted product",
          });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError(err);
    }
  },
  async getAllProduct(req, res, next) {
    const { searchString } = req.body;
    const query = {};
    query.where = {};
    const limit = req.body.limit ? Number(req.body.limit) : 10;
    const page = req.body.page ? Number(req.body.page) : 1;
    query.limit = limit;
    query.offset = limit * (page - 1);
    query.order = [["id", "DESC"]];
    query.where.SellerId = req.user.id;
    query.attributes = [
      "id",
      "SellerId",
      "LocalDeiveryCharge",
      "ZonalDeiveryCharge",
      "NationalDeiveryCharge",
      "WarrantyType",
      "WarrantyPeriod",
      "PubilshStatus",
      "ShippingDays",
      "HighLightDetail",
    ];
    query.include = [
      { model: db.category, as: "maincat", attributes: ["id", "name"] },
      { model: db.SubCategory, attributes: ["id", "sub_name"] },
      { model: db.SubChildCategory, attributes: ["id", "name"] },
      {
        model: db.ProductVariant,
        include: [
          {
            model: db.ch_brand_detail,
            as: "brand",
            attributes: ["id", "name"],
          },
          {
            model: db.ch_color_detail,
            as: "color",
            attributes: ["id", "TITLE", "CODE"],
          },
        ],
      },
      { model: db.ch_specification, attributes: ["id", "type", "value"] },
    ];
    if (searchString) {
      query.where = {
        [Op.and]: [
          {
            [Op.or]: [
              {
                name: {
                  [Op.like]: "%" + searchString + "%",
                },
              },
              {
                id: searchString,
              },
              {
                slug: {
                  [Op.like]: "%" + searchString + "%",
                },
              },
            ],
          },
          { SellerId: req.user.id },
        ],
      };
    }
    try {
      db.product
        .findAndCountAll(query)
        .then((list) => {
          let pages = Math.ceil(list.count / limit);
          const finalResult = {
            count: list.count,
            pages: pages,
            page: req.body.page,
            items: list.rows,
          };
          var response = Util.getFormatedResponse(false, finalResult, {
            message: "Success",
          });
          res.status(response.code).json(response);
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  },
  async updateProduct(req, res, next) {
    try {
      const {
        productId,
        categoryId,
        subCategoryId,
        childCategoryId,
        LocalDeiveryCharge,
        ZonalDeiveryCharge,
        NationalDeiveryCharge,
        warrantyType,
        warrantyPeriod,
        ShippingDays,
        SpecificationDetails,
        priceDetails,
        HighLightDetais,
      } = req.body;
      db.user
        .findOne({
          where: { email: req.user.email, role: req.user.role },
        })
        .then(async (user) => {
          if (user) {
            const t = await db.sequelize.transaction();
            try {
              const productCreated = await db.product.update(
                {
                  categoryId: categoryId,
                  subCategoryId: subCategoryId,
                  childCategoryId: childCategoryId,
                  SellerId: req.user.id,
                  status: "inactive",
                  LocalDeiveryCharge: LocalDeiveryCharge,
                  ZonalDeiveryCharge: ZonalDeiveryCharge,
                  NationalDeiveryCharge: NationalDeiveryCharge,
                  WarrantyType: warrantyType,
                  WarrantyPeriod: warrantyPeriod,
                  ShippingDays: ShippingDays,
                  HighLightDetail: HighLightDetais,
                },
                { where: { id: productId } },
                { transaction: t }
              );

              const featureList = [];
              for (var i = 0; i < SpecificationDetails.length; i++) {
                featureList.push({
                  productId: productId,
                  id: SpecificationDetails[i].id,
                  type: SpecificationDetails[i].type,
                  value: SpecificationDetails[i].value,
                });
              }
              if (featureList.length)
                await db.ch_specification.bulkCreate(
                  featureList,
                  {
                    updateOnDuplicate: Object.keys(featureList[0]),
                  },
                  { transaction: t }
                );

              let priceEntries = [];
              for (var i = 0; i < priceDetails.length; i++) {
                const marginPrice = Math.round(
                  priceDetails[i].distributorPrice - priceDetails[i].buyerPrice
                );
                const marginPer = Math.round(
                  ((priceDetails[i].distributorPrice -
                    priceDetails[i].buyerPrice) /
                    priceDetails[i].distributorPrice) *
                    100
                );
                const discountPer = Math.round(
                  ((priceDetails[i].distributorPrice -
                    priceDetails[i].buyerPrice) /
                    priceDetails[i].distributorPrice) *
                    100
                );
                const discount = Math.round(
                  priceDetails[i].distributorPrice - priceDetails[i].buyerPrice
                );
                const total = Math.round(priceDetails[i].buyerPrice);
                const netPrice = Math.round(priceDetails[i].buyerPrice);
                priceEntries.push({
                  productId: productId,
                  id: priceDetails[i].id,
                  productName: priceDetails[i].productName,
                  slug: convertToSlug(priceDetails[i].productName),
                  productCode: priceDetails[i].productCode
                    ? priceDetails[i].productCode
                    : "PD" + Math.random().toString(36).substr(2, 4),
                  longDesc: priceDetails[i].longDesc,
                  shortDesc: priceDetails[i].shortDesc,
                  distributorPrice: priceDetails[i].distributorPrice,
                  buyerPrice: priceDetails[i].buyerPrice,
                  marginPrice: marginPrice,
                  marginPer: marginPer,
                  discount: discount,
                  discountPer: discountPer,
                  total: total,
                  netPrice: netPrice,
                  unitSize: priceDetails[i].unitSize,
                  qty: priceDetails[i].qty,
                  colorId: priceDetails[i].colorId,
                  brandId: priceDetails[i].brandId,
                  youTubeUrl: priceDetails[i].youTubeUrl,
                  stockType: priceDetails[i].stockType,
                  refundable: priceDetails[i].refundable,
                  qtyWarning: priceDetails[i].qtyWarning,
                  COD: priceDetails[i].COD,
                });
              }
              if (priceEntries.length)
                await db.ProductVariant.bulkCreate(
                  priceEntries,
                  {
                    updateOnDuplicate: Object.keys(priceEntries[0]),
                  },
                  { transaction: t }
                );

              return t.commit();
            } catch (error) {
              await t.rollback();
              throw error;
            }
          }
          throw new RequestError("User not found", 500);
        })

        .then((product) => {
          res.status(200).json({
            status: 201,
            success: true,
            message: "Successfully updated product",
          });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError(err);
    }
  },
  async getPrductById(req, res, next) {
    try {
      db.product
        .findOne({
          attributes: ["id"],
          where: { id: req.body.id, SellerId: req.user.id },
          include: [
            {
              model: db.ProductVariant,
              attributes: ["id", "productId", "productName", "thumbnail"],
              include: [
                {
                  model: db.productphoto,
                  attributes: ["id", "varientId", "imgUrl"],
                },
              ],
            },
          ],
        })
        .then((list) => {
          const featureList = [];
          for (var i = 0; i < list.ProductVariants.length; i++) {
            featureList.push({
              productId: list.id,
              varientId: list.ProductVariants[i].id,
              productName: list.ProductVariants[i].productName,
              thumbnail: list.ProductVariants[i].thumbnail,
              photos: list.ProductVariants[i].productphotos,
            });
          }
          res.status(200).json({
            status: 200,
            success: true,
            data: featureList,
            message: "Success",
          });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      res.status(500).json({ errors: "" + err });
    }
  },
  async sellerImageDetailByid(req, res, next) {
    try {
      db.product
        .findOne({
          attributes: ["id"],
          where: { id: req.query.id, SellerId: { [Op.ne]: null } },
          include: [
            {
              model: db.ProductVariant,
              attributes: ["id", "productId", "productName", "thumbnail"],
              include: [
                {
                  model: db.productphoto,
                  attributes: ["id", "varientId", "imgUrl"],
                },
              ],
            },
          ],
        })
        .then((list) => {
          const featureList = [];
          for (var i = 0; i < list.ProductVariants.length; i++) {
            featureList.push({
              productId: list.id,
              varientId: list.ProductVariants[i].id,
              productName: list.ProductVariants[i].productName,
              thumbnail: list.ProductVariants[i].thumbnail,
              photos: list.ProductVariants[i].productphotos,
            });
          }
          res.status(200).json({
            status: 200,
            success: true,
            data: featureList,
            message: "Success",
          });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      res.status(500).json({ errors: "" + err });
    }
  },
  async uploadSingleImage(req, res, next) {
    try {
      db.ProductVariant.findOne({
        where: { productId: req.body.productId, id: req.body.varientId },
      })
        .then((list) => {
          if (list) {
            return db.ProductVariant.update(
              {
                thumbnail: req.file ? req.file.location : null,
              },
              {
                where: {
                  productId: req.body.productId,
                  id: req.body.varientId,
                },
              }
            );
          }
        })
        .then((success) => {
          res.status(200).json({
            status: 200,
            success: true,
            message: "Image uploaded successfully",
          });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      res.status(500).json({ errors: "" + err });
    }
  },
  async deleteThumbnail(req, res, next) {
    try {
      deleteFileFromS3(req.body.thumbnail)
        .then((data) => {
          if (!data) {
            return db.ProductVariant.findOne({
              where: { productId: req.body.productId, id: req.body.varientId },
            });
          }
          throw new RequestError("error");
        })
        .then((list) => {
          if (list) {
            return db.ProductVariant.update(
              {
                thumbnail: null,
              },
              {
                where: {
                  productId: req.body.productId,
                  id: req.body.varientId,
                },
              }
            );
          }
        })
        .then((success) => {
          res.status(200).json({
            status: 200,
            success: true,
            message: "Image delete successfully",
          });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError(err);
    }
  },
  async dashboardList(req, res, next) {
    try {
      db.product
        .findAll({
          where: { SellerId: req.user.id },
          order: [["createdAt", "DESC"]],
          attributes: [
            "id",
            "SellerId",
            "LocalDeiveryCharge",
            "ZonalDeiveryCharge",
            "NationalDeiveryCharge",
            "WarrantyType",
            "WarrantyPeriod",
            "PubilshStatus",
            "ShippingDays",
            "HighLightDetail",
          ],
          include: [
            { model: db.category, as: "maincat", attributes: ["id", "name"] },
            { model: db.SubCategory, attributes: ["id", "sub_name"] },
            { model: db.SubChildCategory, attributes: ["id", "name"] },
            { model: db.ProductVariant },
          ],
        })
        .then((list) => {
          const featureList = [];
          for (var i = 0; i < list.length; i++) {
            featureList.push({
              category:
                list[i].maincat.name + ">" + list[i] && list[i].SubCategory
                  ? list[i].SubCategory.sub_name
                  : "" +
                    ">" +
                    (list[i].SubChildCategory
                      ? list[i].SubChildCategory.name
                      : null),
              count: list[i].ProductVariants.length,
            });
          }
          res.status(200).json({
            status: 200,
            success: true,
            data: featureList,
            message: "Success",
          });
        })
        .catch(function (err) {
          console.log(err);
          next(err);
        });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  async getAllList(req, res, next) {
    try {
      db.ProductVariant.findAll({
        attributes: ["id", "productName"],
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: db.product,
            where: { SellerId: req.user.id },
            attributes: ["id"],
          },
        ],
      })
        .then((list) => {
          res.status(200).json({
            status: 200,
            success: true,
            data: list,
            message: "Success",
          });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  },
  async couponCreate(req, res, next) {
    const { Code, VarientId, StartDate, EndDate, Type, Value } = req.body;
    try {
      db.ch_coupon_detail
        .findOne({
          where: { VarientId: VarientId },
        })
        .then((list) => {
          if (!list) {
            return db.ch_coupon_detail.create({
              Code: Code,
              VarientId: VarientId,
              StartDate: StartDate,
              EndDate: EndDate,
              Type: Type,
              Value: Value,
              Status: true,
            });
          }
          throw new RequestError("Already exist in list");
        })
        .then((success) => {
          res.status(200).json({
            status: 201,
            success: true,
            message: "Successfully created",
          });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      res.status(500).json({ errors: "" + err });
    }
  },
  async couponList(req, res, next) {
    try {
      db.ch_coupon_detail
        .findAll({
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: db.ProductVariant,
              as: "product",
              attributes: ["id", "productName"],
            },
          ],
        })
        .then((list) => {
          res.status(200).json({
            status: 200,
            success: true,
            data: list,
            message: "Success",
          });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  },

  async couponDelete(req, res, next) {
    try {
      db.ch_coupon_detail
        .findOne({
          where: { id: req.query.id },
        })
        .then((list) => {
          if (list) {
            return db.ch_coupon_detail.destroy({ where: { id: list.id } });
          }
          throw new RequestError("Coupon is not found");
        })
        .then((success) => {
          res
            .status(200)
            .json({ status: 200, success: true, message: "Success deleted" });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  },
  async getAllBrandList(req, res, next) {
    try {
      db.ch_brand_detail
        .findAll()
        .then((list) => {
          var response = Util.getFormatedResponse(false, list, {
            message: "Success",
          });
          res.status(response.code).json(response);
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError(err);
    }
  },
  async getAllProductList(req, res, next) {
    const { searchString } = req.query;
    let arrData = [];
    const query = {};
    query.where = {};
    try {
      if (searchString) {
        query.where.productName = {
          [Op.like]: "%" + searchString + "%",
        };
      }
      //limit
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const page = req.query.page ? Number(req.query.page) : 1;
      query.limit = limit;
      query.offset = limit * (page - 1);
      query.order = [["createdAt", "Desc"]];
      query.include = [
        {
          model: db.product,
          where: {
            SellerId: { [Op.not]: null },
          },
          offset: limit * (page - 1),
          attributes: [
            "id",
            "SellerId",
            "PubilshStatus",
            "categoryId",
            "subCategoryId",
            "childCategoryId",
          ],
          include: [
            { model: db.category, as: "maincat", attributes: ["id", "name"] },
            { model: db.SubCategory, attributes: ["id", "sub_name"] },
            { model: db.SubChildCategory, attributes: ["id", "name"] },
          ],
        },
        {
          model: db.ch_brand_detail,
          as: "brand",
          attributes: ["id", "name", "slug"],
        },
        {
          model: db.ch_color_detail,
          as: "color",
          attributes: ["id", "TITLE", "CODE"],
        },
        { model: db.productphoto, attributes: ["id", "imgUrl"] },
      ];
      const productlist = await db.ProductVariant.findAndCountAll(query);
      if (productlist.count === 0) {
        let response = Util.getFormatedResponse(false, {
          message: "No data found",
        });
        res.status(response.code).json(response);
      } else {
        productlist.rows.forEach((value) => {
          const dataList = {
            id: value ? value.id : "",
            productId: value.product ? value.product.id : "",
            name: value ? value.productName : "",
            code: value ? value.productCode : "",
            slug: value ? value.slug : null,
            Available: value ? value.Available : null,
            qty: value ? value.qty : null,
            thumbnail: value ? value.thumbnail : null,
            distributorPrice: value ? value.distributorPrice : null,
            marginPer: value ? value.marginPer : null,
            marginPrice: value ? value.marginPrice : null,
            buyerPrice: value ? value.buyerPrice : null,
            qty: value ? value.qty : null,
            discount: value ? value.discount : null,
            discountPer: value ? value.discountPer : null,
            total: value ? value.total : null,
            netPrice: value ? value.netPrice : null,
            sellerPrice: value ? value.sellerPrice : null,
            maincat: value.product ? value.product.maincat.name : null,
            BrandName: value.brand ? value.brand : null,
            subcat: value.product.SubCategory
              ? value.product.SubCategory.sub_name
              : "",
            childcat: value.product.SubChildCategory
              ? value.product.SubChildCategory.name
              : "",
            PubilshStatus: value.product.PubilshStatus,
          };
          arrData.push(dataList);
        });
        let pages = Math.ceil(productlist.count / limit);
        const finalResult = {
          count: productlist.count,
          pages: pages,
          page: req.query.page,
          items: arrData,
        };
        let response = Util.getFormatedResponse(false, finalResult, {
          message: "Success",
        });
        res.status(response.code).json(response);
      }
    } catch (err) {
      console.log(err);
      throw new RequestError(err);
    }
  },
  async sellerProductUpdate(req, res, next) {
    try {
      const { id, distributorPrice, sellerPrice, buyerPrice } = req.body;
      const marginPrice = Math.round(distributorPrice - buyerPrice);
      const marginPer = Math.round(
        ((distributorPrice - buyerPrice) / distributorPrice) * 100
      );
      const discountPer = Math.round(
        ((distributorPrice - sellerPrice) / distributorPrice) * 100
      );
      const discount = Math.round(distributorPrice - sellerPrice);
      const total = Math.round(sellerPrice);
      const netPrice = Math.round(sellerPrice);

      db.ProductVariant.findOne({
        where: { id: id },
      })
        .then((product) => {
          if (product.id) {
            return db.ProductVariant.update(
              {
                sellerPrice: sellerPrice,
                marginPer: marginPer,
                marginPrice,
                marginPrice,
                discount: discount,
                discountPer: discountPer,
                total,
                total,
                netPrice: netPrice,
              },
              { where: { id: id } }
            );
          }
          throw new RequestError("Product not found", 500);
        })

        .then((product) => {
          let response = Util.getFormatedResponse(false, {
            message: "Successfully updated",
          });
          res.status(response.code).json(response);
        })
        .catch(function (err) {
          let response = Util.getFormatedResponse(true, {
            message: err,
          });
          res.status(response.code).json(response);
        });
    } catch (err) {
      throw new RequestError(err);
    }
  },
  async updatePriceByBrand(req, res, next) {
    try {
      const { id, discountPer } = req.body;
      const BrandDetail = await db.ch_brand_detail.findOne({
        where: { id: id },
      });
      if (BrandDetail.id) {
        await db.ProductVariant.findAll({
          where: { brandId: BrandDetail.id },
        })
          .then(async (varient) => {
            const t = await db.sequelize.transaction();
            try {
              if (varient.length) {
                const arrData = [];
                varient.forEach((value) => {
                  const MRP = value.distributorPrice;
                  const discount = Math.round((MRP * discountPer) / 100);
                  const customerPrice = Math.round(MRP - discount);
                  const total = Math.round(customerPrice);
                  const netPrice = Math.round(customerPrice);
                  arrData.push({
                    id: value.id,
                    distributorPrice: value.distributorPrice,
                    buyerPrice: value.buyerPrice,
                    qty: value.qty,
                    productCode: value.productCode,
                    discountPer: discountPer,
                    discount: discount,
                    sellerPrice: customerPrice,
                    total: total,
                    netPrice: netPrice,
                  });
                });
                if (arrData.length)
                  await db.ProductVariant.bulkCreate(
                    arrData,
                    {
                      updateOnDuplicate: Object.keys(arrData[0]),
                    },
                    { transaction: t }
                  );
                await db.ch_brand_detail.update(
                  {
                    DiscountPer: discountPer,
                  },
                  { where: { id: BrandDetail.id } },
                  { transaction: t }
                );

                return t.commit();
              }
            } catch (error) {
              // If the execution reaches this line, an error was thrown.
              await t.rollback();
              throw error;
            }
          })
          .then((success) => {
            let response = Util.getFormatedResponse(false, {
              message: success,
            });
            res.status(response.code).json(response);
          })
          .catch((err) => {
            console.log("err:", err);
            let response = Util.getFormatedResponse(true, {
              message: err,
            });
            res.status(response.code).json(response);
          });
      } else {
        let response = Util.getFormatedResponse(false, {
          message: "No data found",
        });
        res.status(response.code).json(response);
      }
    } catch (err) {
      throw new RequestError(err);
    }
  },
  async historyProduct(req, res, next) {
    const { searchString } = req.query;
    const query = {};
    query.where = {};

    const whereCond = {};
    whereCond.where = {};
    if (searchString) {
      query.where = {
        [Op.or]: [
          {
            id: {
              [Op.like]: "%" + searchString + "%",
            },
          },
          {
            name: {
              [Op.like]: "%" + searchString + "%",
            },
          },
          {
            slug: {
              [Op.like]: "%" + searchString + "%",
            },
          },
        ],
      };

      // whereCond.where.productName = {
      //   [Op.like]: "%" + searchString + "%",
      // };
    }
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const page = req.query.page ? Number(req.query.page) : 1;
    query.limit = limit;
    query.offset = limit * (page - 1);
    query.where.SellerId = {
      [Op.not]: null,
    };
    query.order = [["id", "DESC"]];
    query.attributes = [
      "id",
      "SellerId",
      "name",
      "LocalDeiveryCharge",
      "ZonalDeiveryCharge",
      "NationalDeiveryCharge",
      "WarrantyType",
      "WarrantyPeriod",
      "PubilshStatus",
      "ShippingDays",
      "HighLightDetail",
    ];
    try {
      db.product
        .findAndCountAll({
          ...query,
          include: [
            { model: db.category, as: "maincat", attributes: ["id", "name"] },
            { model: db.SubCategory, attributes: ["id", "sub_name"] },
            { model: db.SubChildCategory, attributes: ["id", "name"] },
            {
              model: db.ProductVariant,
              ...whereCond,
              include: [
                {
                  model: db.ch_brand_detail,
                  as: "brand",
                  attributes: ["id", "name"],
                },
                {
                  model: db.ch_color_detail,
                  as: "color",
                  attributes: ["id", "TITLE", "CODE"],
                },
              ],
            },
            { model: db.ch_specification, attributes: ["id", "type", "value"] },
          ],
        })
        .then((list) => {
          if (list.count === 0) {
            let response = Util.getFormatedResponse(false, {
              message: "No data found",
            });
            res.status(response.code).json(response);
          } else {
            let pages = Math.ceil(list.count / limit);
            const finalResult = {
              count: list.count,
              pages: pages,
              page: req.query.page,
              items: list.rows,
            };
            let response = Util.getFormatedResponse(false, finalResult, {
              message: "Success",
            });
            res.status(response.code).json(response);
          }
        })
        .catch(function (err) {
          console.log(err);
          next(err);
        });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  async CommonName(req, res, next) {
    const { id, name, slug } = req.body;

    try {
      db.product
        .findOne({
          where: { id: id },
        })
        .then((list) => {
          if (!list) {
            let response = Util.getFormatedResponse(false, {
              message: "No data found",
            });
            res.status(response.code).json(response);
          } else {
            const success = db.product.update(
              {
                name: name,
                slug: slug,
              },
              { where: { id: id } }
            );
            console.log(JSON.stringify(success));
            if (success) {
              let response = Util.getFormatedResponse(false, {
                message: "Success",
              });
              res.status(response.code).json(response);
            }
          }
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      res.status(500).json({ errors: "" + err });
    }
  },
};
