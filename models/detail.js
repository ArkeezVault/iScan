"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Request, Name, Attachment }) {
      // define association here
      this.belongsTo(Request, {
        foreignKey: "request_id",
        targetKey: "request_id",
      });

      this.hasOne(Name, {
        foreignKey: "id",
        sourceKey: "type_id",
        as: "scan",
      });

      this.hasMany(Attachment, {
        foreignKey: "parent_id",
        as: "attachments",
      });
    }
  }
  Detail.init(
    {
      request_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "requested",
      },
      attachment_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Detail",
      tableName: "request_details",
      underscored: true,
    }
  );
  return Detail;
};
