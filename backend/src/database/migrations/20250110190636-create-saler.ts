import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.createTable("Salers", {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        cpf: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        branch: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        situation: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        commercialAssistent: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "Desconhecido",
        },
        commercialGroup: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "Desconhecido",
        },
        freeBelt: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "Desconhecido",
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "Desconhecido",
        },
        city: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "Desconhecido",
        },
        birthdate: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "Desconhecido",
        },
        productionInMonth: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      }),
    ]);
  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.dropTable("Salers"),
    ]);
  },
};
