'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ch_salon_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      OWNERID: {
        type: Sequelize.INTEGER
      },
      NAME: {
        type: Sequelize.STRING
      },
      SLUG: {
        type: Sequelize.STRING
      },
      THUMBNAIL: {
        type: Sequelize.STRING
      },
      PHONENO: {
        type: Sequelize.STRING
      },
      CITY: {
        type: Sequelize.INTEGER
      },
      ADDRESS: {
        type: Sequelize.TEXT
      },
      LAT: {
        type: Sequelize.FLOAT
      },
      LONG: {
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
    return queryInterface.dropTable('ch_salon_details');
  }
};