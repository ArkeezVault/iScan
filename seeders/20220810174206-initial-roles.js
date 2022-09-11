"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          id: 1,
          name: "patient",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: "doctor",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          name: "admin",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 4,
          name: "superadmin",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("roles", null, {});
  },
};
