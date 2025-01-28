"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "features",
      [
        {
          id: 1,
          name: "cada",
          description: "",
        },
        {
          id: 2,
          name: "m2d",
          description: "",
        },
        {
          id: 3,
          name: "crc",
          description: "",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("features", null, {});
  },
};
