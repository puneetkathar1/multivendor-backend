module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('ch_salon_details', 'STATUS', {
        type: Sequelize.BOOLEAN
      });
      await queryInterface.addColumn('ch_salon_owners', 'STATUS', {
        type: Sequelize.BOOLEAN
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('ch_salon_details', 'STATUS');
      await queryInterface.removeColumn('ch_salon_owners', 'STATUS');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
};