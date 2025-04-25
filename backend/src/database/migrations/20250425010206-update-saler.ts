import { DataTypes, QueryInterface } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    // Renomear a coluna
    await queryInterface.renameColumn(
      "Salers",
      "productionInMonth",
      "productionInActualMonth"
    );

    // Alterar o tipo após renomear
    await queryInterface.changeColumn("Salers", "productionInActualMonth", {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    });

    // Adicionar novas colunas
    await Promise.all([
      queryInterface.addColumn("Salers", "productionInLastMonth", {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      }),
      queryInterface.addColumn("Salers", "digitationInActualMonth", {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      }),
      queryInterface.addColumn("Salers", "digitationInLastMonth", {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      }),
      queryInterface.addColumn("Salers", "paidContractsInMonth", {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }),
      queryInterface.addColumn("Salers", "typedContractsInMonth", {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      })
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    // Reverter nome da coluna
    await queryInterface.renameColumn(
      "Salers",
      "productionInActualMonth",
      "productionInMonth"
    );

    await Promise.all([
      queryInterface.removeColumn("Salers", "productionInLastMonth"),
      queryInterface.removeColumn("Salers", "digitationInActualMonth"),
      queryInterface.removeColumn("Salers", "digitationInLastMonth"),
      queryInterface.removeColumn("Salers", "paidContractsInMonth"),
      queryInterface.removeColumn("Salers", "typedContractsInMonth")
    ]);
  }
};
