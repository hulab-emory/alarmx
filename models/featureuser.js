"use strict";

// +FK UserId, FeatureId
const FeatureUserModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "featureUser",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );
};

module.exports = FeatureUserModel;
