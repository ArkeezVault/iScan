"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("zones", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      label_en: {
        type: Sequelize.STRING,
      },
      label_ar: {
        type: Sequelize.STRING,
      },
      governorate_en: {
        type: Sequelize.STRING,
      },
      governorate_ar: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("zones");
  },
};
