"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Name }) {
      // define association here
      this.hasMany(Name, {
        foreignKey: "type_id",
        as: "scan_names",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }
  Type.init(
    {
      title: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Type",
      tableName: "scan_types",
      underscored: true,
    }
  );
  return Type;
};
