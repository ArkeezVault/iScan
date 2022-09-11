"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BranchZone extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BranchZone.init(
    {
      branch_id: DataTypes.INTEGER,
      zone_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "BranchZone",
      tableName: "branch_zones",
      timestamps: false,
    }
  );
  return BranchZone;
};
