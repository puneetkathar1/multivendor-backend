"use strict";
module.exports = (sequelize, DataTypes) => {
  const ch_salon_price_detail = sequelize.define(
    "ch_salon_price_detail",
    {
      SALONID: DataTypes.INTEGER,
      OWNERID: DataTypes.INTEGER,
      SERVICEID: DataTypes.INTEGER,
      GENDER: DataTypes.STRING,
      CAT_ID: DataTypes.INTEGER,
      PRICE: DataTypes.INTEGER,
      DISCOUNTPER: DataTypes.INTEGER,
      DISCOUNTPRICE: DataTypes.FLOAT,
      TOTAL: DataTypes.FLOAT,
      GRANDTOTAL: DataTypes.FLOAT,
    },
    {}
  );
  ch_salon_price_detail.associate = function (models) {
    // associations can be defined here
    models.ch_salon_price_detail.hasOne(models.ch_salon_service, {
      foreignKey: "id",
      sourceKey: "SERVICEID",
      as: "servicelist",
    });

    models.ch_salon_price_detail.belongsTo(models.ch_salon_detail, {
      as: "pricelist",
      foreignKey: "SALONID",
    });
    models.ch_salon_price_detail.belongsTo(models.ch_salon_service, {
      as: "priceDetail",
      foreignKey: "SERVICEID",
    });
  };
  return ch_salon_price_detail;
};
