"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("requests", "branch_id", Sequelize.INTEGER, {
      after: "request_date",
    });

    await queryInterface.addColumn("requests", "created_by", Sequelize.STRING, {
      after: "branch_id",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("requests", "branch_id");
    await queryInterface.removeColumn("requests", "created_by");
  },
};
