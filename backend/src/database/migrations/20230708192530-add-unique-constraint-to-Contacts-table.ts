import { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const [results] = await queryInterface.sequelize.query(`
      SELECT conname
      FROM pg_constraint
      WHERE conname = 'number_companyid_unique';
    `);

    if (results.length === 0) {
      return queryInterface.addConstraint("Contacts", ["number", "companyId"], {
        type: "unique",
        name: "number_companyid_unique",
      });
    }
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeConstraint(
      "Contacts",
      "number_companyid_unique"
    );
  },
};
