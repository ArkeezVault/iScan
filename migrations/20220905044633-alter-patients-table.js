"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("patients", "gender", Sequelize.STRING, {
      after: "phone",
    });
    await queryInterface.addColumn("patients", "dob", Sequelize.DATEONLY);
    await queryInterface.addColumn("patients", "zone", Sequelize.INTEGER);
    await queryInterface.addColumn("patients", "address", Sequelize.STRING);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("patients", "gender");
    await queryInterface.removeColumn("patients", "dob");
    await queryInterface.removeColumn("patients", "zone");
    await queryInterface.removeColumn("patients", "address");
  },
};
