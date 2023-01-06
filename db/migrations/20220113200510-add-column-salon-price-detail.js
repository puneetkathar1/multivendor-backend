module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn("ch_salon_price_details", "GENDER", {
        type: Sequelize.STRING,
        after: "SERVICEID",
      });
      await queryInterface.addColumn("ch_salon_services", "OWNERID", {
        type: Sequelize.INTEGER,
        after: "CAT_ID",
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn("ch_salon_price_details", "GENDER");
      await queryInterface.removeColumn("ch_salon_price_details", "OWNERID");
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },
};
