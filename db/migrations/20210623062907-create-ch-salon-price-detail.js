'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ch_salon_price_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      SALONID: {
        type: Sequelize.INTEGER
      },
      OWNERID: {
        type: Sequelize.INTEGER
      },
      SERVICEID: {
        type: Sequelize.INTEGER
      },
      PRICE: {
        type: Sequelize.INTEGER
      },
      DISCOUNTPER: {
        type: Sequelize.INTEGER
      },
      DISCOUNTPRICE: {
        type: Sequelize.FLOAT
      },
      TOTAL: {
        type: Sequelize.FLOAT
      },
      GRANDTOTAL: {
        type: Sequelize.FLOAT
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
    return queryInterface.dropTable('ch_salon_price_details');
  }
};