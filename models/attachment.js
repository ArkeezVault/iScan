"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Tooth, Detail }) {
      // define association here
      this.belongsTo(Tooth, {
        foreignKey: "parent_id",
      });

      this.belongsTo(Detail, {
        foreignKey: "parent_id",
      });
    }
  }
  Attachment.init(
    {
      parent_id: DataTypes.STRING,
      parent_type: DataTypes.STRING,
      url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Attachment",
      tableName: "attachments",
      underscored: true,
    }
  );
  return Attachment;
};
