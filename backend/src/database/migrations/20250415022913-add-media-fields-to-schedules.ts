module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Schedules", "mediaPath", {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn("Schedules", "fileName", {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Schedules", "mediaPath");
    await queryInterface.removeColumn("Schedules", "fileName");
  }
};
