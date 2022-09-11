"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RequestTooth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RequestTooth.init(
    {
      request_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tooth_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RequestTooth",
      tableName: "request_teeth",
      timestamps: false,
    }
  );
  return RequestTooth;
};
