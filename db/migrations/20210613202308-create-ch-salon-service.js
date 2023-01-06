'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ch_salon_services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      SERVICENAME: {
        type: Sequelize.STRING
      },
      SORTDESC: {
        type: Sequelize.TEXT
      },
      STATUS: {
        type: Sequelize.BOOLEAN
      },
      CAT_ID: {
        type: Sequelize.INTEGER
      },
      SLUG: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('ch_salon_services');
  }
};