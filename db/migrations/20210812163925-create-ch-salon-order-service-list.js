'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ch_salon_order_service_lists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ORDERID: {
        type: Sequelize.INTEGER
      },
      CUSTID: {
        type: Sequelize.INTEGER
      },
      PARLOURID: {
        type: Sequelize.INTEGER
      },
      CATID: {
        type: Sequelize.INTEGER
      },
      PARLOURNAME: {
        type: Sequelize.STRING
      },
      SERVICENAME: {
        type: Sequelize.STRING
      },
      DISCOUNTPER: {
        type: Sequelize.DOUBLE
      },
      DISCOUNTPRICE: {
        type: Sequelize.DOUBLE
      },
      PRICE: {
        type: Sequelize.DOUBLE
      },
      GRANDTOTAL: {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ch_salon_order_service_lists');
  }
};