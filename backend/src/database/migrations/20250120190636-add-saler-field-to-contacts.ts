import { DataTypes, QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Contacts", "salerId", {
      type: DataTypes.INTEGER,
      references: {
        model: "Salers",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Contacts", "salerId");
  }
};
