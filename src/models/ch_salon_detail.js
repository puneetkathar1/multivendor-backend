"use strict";
module.exports = (sequelize, DataTypes) => {
  const ch_salon_detail = sequelize.define(
    "ch_salon_detail",
    {
      OWNERID: DataTypes.INTEGER,
      NAME: DataTypes.STRING,
      SLUG: DataTypes.STRING,
      STATUS: DataTypes.STRING,
      THUMBNAIL: DataTypes.STRING,
      PHONENO: DataTypes.STRING,
      CITY: DataTypes.INTEGER,
      ADDRESS: DataTypes.TEXT,
      LAT: DataTypes.FLOAT,
      LONG: DataTypes.FLOAT,
    },
    {}
  );
  ch_salon_detail.associate = function (models) {
    models.ch_salon_detail.hasMany(models.ch_salon_price_detail, {
      as: "pricelist",
      foreignKey: "SALONID",
    });

    models.ch_salon_detail.hasOne(models.ch_city, {
      foreignKey: "id",
      sourceKey: "CITY",
      as: "city",
    });

    models.ch_salon_detail.hasOne(models.user, {
      foreignKey: "id",
      sourceKey: "OWNERID",
      as: "owner",
    });
  };
  return ch_salon_detail;
};
