"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("branch_zones", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      branch_id: {
        type: Sequelize.INTEGER,
      },
      zone_id: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("branch_zones");
  },
};
