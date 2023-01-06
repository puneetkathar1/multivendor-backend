"use strict";
module.exports = (sequelize, DataTypes) => {
  const ch_salon_order_list = sequelize.define(
    "ch_salon_order_list",
    {
      CUSTID: DataTypes.INTEGER,
      USERID: DataTypes.INTEGER,
      ORDERNO: DataTypes.STRING,
      FIRSTNAME: DataTypes.STRING,
      LASTNAME: DataTypes.STRING,
      PHONENO: DataTypes.STRING,
      EMAIL: DataTypes.STRING,
      GRANDTOTAL: DataTypes.DOUBLE,
      APPOINTMENTDATE: DataTypes.DATE,
    },
    {}
  );
  ch_salon_order_list.associate = function (models) {
    // associations can be defined here

    models.ch_salon_order_list.hasMany(models.ch_salon_order_service_list, {
      foreignKey: "ORDERID",
    });
  };
  return ch_salon_order_list;
};
