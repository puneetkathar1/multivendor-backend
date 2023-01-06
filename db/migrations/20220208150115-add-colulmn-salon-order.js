module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn("ch_salon_order_lists", "USERID", {
        type: Sequelize.INTEGER,
        after: "CUSTID",
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn("ch_salon_order_lists", "USERID");
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },
};
