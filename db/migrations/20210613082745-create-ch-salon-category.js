'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ch_salon_categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      salonCategoryName: {
        type: Sequelize.STRING
      },
      salonSlug: {
        type: Sequelize.STRING
      },
      sortDesc: {
        type: Sequelize.TEXT
      },
      Gender: {
        type: Sequelize.STRING
      },
      Thumbnail: {
        type: Sequelize.STRING
      },
      Status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 1
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
    return queryInterface.dropTable('ch_salon_categories');
  }
};