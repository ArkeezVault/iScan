"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Name extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Type, Detail }) {
      // define association here
      this.belongsTo(Type);

      this.belongsTo(Detail, {
        foreignKey: "id",
        targetKey: "type_id",
      });
    }
  }
  Name.init(
    {
      type_id: DataTypes.STRING,
      title: DataTypes.STRING,
      price: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
      },
    },
    {
      sequelize,
      modelName: "Name",
      tableName: "scan_names",
      underscored: true,
    }
  );
  return Name;
};
