"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "featureUsers",
      [
        ["admin", 1, 1],
        ["user", 1, 4],
        ["Regular", 2, 1],
        ["Admin", 2, 2],
        ["admin", 3, 2],
        ["Internal", 2, 3],
        ["Admin", 2, 4],
        ["Internal", 2, 5],
        ["Internal", 2, 6],
        ["Internal", 2, 7],
        ["Internal", 2, 8],
      ].map((entry) => ({
        role: entry[0],
        status: "Active",
        featureId: entry[1],
        userId: entry[2],
      })),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("featureUsers", null, {});
  },
};
