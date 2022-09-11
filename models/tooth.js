"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tooth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Attachment, Request, RequestTooth }) {
      // define association here
      this.hasOne(Attachment, {
        foreignKey: "parent_id",
        as: "image",
      });

      this.belongsToMany(Request, {
        through: RequestTooth,
        foreignKey: "tooth_id",
        as: "requests",
      });
    }
  }
  Tooth.init(
    {
      index: DataTypes.STRING,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Tooth",
      tableName: "teeth",
      underscored: true,
    }
  );
  return Tooth;
};
