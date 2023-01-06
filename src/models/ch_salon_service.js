"use strict";
module.exports = (sequelize, DataTypes) => {
  const ch_salon_service = sequelize.define(
    "ch_salon_service",
    {
      SERVICENAME: DataTypes.STRING,
      SORTDESC: DataTypes.TEXT,
      STATUS: DataTypes.BOOLEAN,
      CAT_ID: DataTypes.INTEGER,
      OWNERID: DataTypes.INTEGER,
      SLUG: DataTypes.STRING,
    },
    {}
  );
  ch_salon_service.associate = function (models) {
    // associations can be defined here
    models.ch_salon_service.hasOne(models.ch_salon_category, {
      foreignKey: "id",
      sourceKey: "CAT_ID",
      as: "category",
    });
    models.ch_salon_service.belongsTo(models.ch_salon_category, {
      as: "service",
      foreignKey: "CAT_ID",
    });
    models.ch_salon_service.hasMany(models.ch_salon_price_detail, {
      as: "priceDetail",
      foreignKey: "SERVICEID",
    });
  };
  return ch_salon_service;
};
