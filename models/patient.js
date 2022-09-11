"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Request }) {
      // define association here
      this.hasOne(User, {
        foreignKey: "user_id",
        sourceKey: "user_id",
        as: "user",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      this.hasMany(Request, {
        foreignKey: "patient_id",
        sourceKey: "user_id",
        as: "requests",
      });
    }
  }
  Patient.init(
    {
      user_id: DataTypes.STRING,
      patient_name: DataTypes.STRING,
      phone: DataTypes.STRING,
      gender: DataTypes.STRING,
      dob: DataTypes.DATEONLY,
      zone: DataTypes.INTEGER,
      address: DataTypes.STRING,
      doctor_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Patient",
      tableName: "patients",
      underscored: true,
    }
  );
  return Patient;
};
