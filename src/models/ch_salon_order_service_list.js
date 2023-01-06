'use strict';
module.exports = (sequelize, DataTypes) => {
  const ch_salon_order_service_list = sequelize.define('ch_salon_order_service_list', {
    ORDERID: DataTypes.INTEGER,
    CUSTID: DataTypes.INTEGER,
    PARLOURID: DataTypes.INTEGER,
    CATID: DataTypes.INTEGER,
    PARLOURNAME: DataTypes.STRING,
    SERVICENAME: DataTypes.STRING,
    DISCOUNTPER: DataTypes.DOUBLE,
    DISCOUNTPRICE: DataTypes.DOUBLE,
    PRICE: DataTypes.DOUBLE,
    GRANDTOTAL: DataTypes.DOUBLE
  }, {});
  ch_salon_order_service_list.associate = function (models) {
    // associations can be defined here

    models.ch_salon_order_service_list.belongsTo(models.ch_salon_order_list, { foreignKey: 'ORDERID' });


  };
  return ch_salon_order_service_list;
};