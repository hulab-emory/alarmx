"use strict";

const FeatureModel = function (sequelize, DataTypes) {
  return sequelize.define(
    "feature",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      allowSignup: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
    }
  );
};

module.exports = FeatureModel;
