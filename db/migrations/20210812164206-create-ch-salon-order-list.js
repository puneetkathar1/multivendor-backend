'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ch_salon_order_lists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CUSTID: {
        type: Sequelize.INTEGER
      },
      ORDERNO: {
        type: Sequelize.STRING
      },
      FIRSTNAME: {
        type: Sequelize.STRING
      },
      LASTNAME: {
        type: Sequelize.STRING
      },
      PHONENO: {
        type: Sequelize.STRING
      },
      EMAIL: {
        type: Sequelize.STRING
      },
      GRANDTOTAL: {
        type: Sequelize.DOUBLE
      },
      APPOINTMENTDATE: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('ch_salon_order_lists');
  }
};