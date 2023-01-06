module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn("BannerDetails", "type", {
        type: Sequelize.ENUM,
        values: ["0", "1"],
        comment: "0 (laptop), 1 (mobile)",
        after: "status",
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn("BannerDetails", "type");
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },
};
