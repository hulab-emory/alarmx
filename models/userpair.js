"use strict";

const UserPairModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "userPair",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      user1Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user2Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user1Status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Pending",
      },
      user2Status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Pending",
      },
      featureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
};

module.exports = UserPairModel;