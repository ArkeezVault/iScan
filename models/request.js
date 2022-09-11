"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Doctor,
      Patient,
      Detail,
      Attachment,
      Branch,
      Tooth,
      RequestTooth,
    }) {
      // define association here
      this.belongsTo(Doctor, {
        foreignKey: "doctor_id",
        targetKey: "user_id",
        as: "doctor",
      });

      this.belongsTo(Patient, {
        foreignKey: "patient_id",
        targetKey: "user_id",
        as: "patient",
      });

      this.hasMany(Detail, {
        foreignKey: "request_id",
        sourceKey: "request_id",
        as: "details",
      });

      this.belongsToMany(Tooth, {
        through: RequestTooth,
        foreignKey: "request_id",
        as: "teeth",
      });

      this.hasOne(Branch, {
        foreignKey: "id",
        sourceKey: "branch_id",
        as: "branch",
      });

      this.hasMany(Attachment, { foreignKey: "request_id" });
    }
  }
  Request.init(
    {
      request_id: DataTypes.STRING,
      doctor_id: DataTypes.STRING,
      patient_id: DataTypes.STRING,
      request_date: DataTypes.DATEONLY,
      branch_id: DataTypes.INTEGER,
      created_by: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Request",
      tableName: "requests",
      underscored: true,
    }
  );
  return Request;
};
