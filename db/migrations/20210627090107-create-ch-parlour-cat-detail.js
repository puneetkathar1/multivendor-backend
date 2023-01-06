'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ch_parlour_cat_details', {
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
      CAT_ID: {
        type: Sequelize.INTEGER
      },
      SERVICEID: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('ch_parlour_cat_details');
  }
};