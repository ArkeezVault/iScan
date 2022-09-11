"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Request }) {
      // define association here
      this.hasOne(User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      this.hasMany(Request, {
        foreignKey: "doctor_id",
        sourceKey: "user_id",
        as: "requests",
      });
    }
  }
  Doctor.init(
    {
      user_id: DataTypes.STRING,
      doctor_name: DataTypes.STRING,
      phone: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Doctor",
      tableName: "doctors",
      underscored: true,
    }
  );
  return Doctor;
};
