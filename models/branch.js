"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Zone, BranchZone, Request }) {
      // define association here
      this.belongsToMany(Zone, {
        through: BranchZone,
        foreignKey: "branch_id",
        as: "zones",
      });

      this.belongsTo(Request, {
        foreignKey: "id",
        targetKey: "branch_id",
      });
    }
  }
  Branch.init(
    {
      label_en: DataTypes.STRING,
      label_ar: DataTypes.STRING,
      governorate_en: DataTypes.STRING,
      governorate_ar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Branch",
      tableName: "branches",
      underscored: true,
    }
  );
  return Branch;
};
