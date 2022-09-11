"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("request_teeth", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      request_id: {
        type: Sequelize.STRING,
      },
      tooth_id: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("request_teeth");
  },
};
