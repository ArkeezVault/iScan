"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Zone extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Branch, BranchZone }) {
      // define association here
      this.belongsToMany(Branch, {
        through: BranchZone,
        foreignKey: "zone_id",
        as: "branches",
      });
    }
  }
  Zone.init(
    {
      label_en: DataTypes.STRING,
      label_ar: DataTypes.STRING,
      governorate_en: DataTypes.STRING,
      governorate_ar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Zone",
      tableName: "zones",
      underscored: true,
    }
  );
  return Zone;
};
