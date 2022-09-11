"use strict";
const { Model } = require("sequelize");

const generateUniqueId = require("generate-unique-id");

const identifier = () => generateUniqueId({ length: 8 });

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Role, Doctor, Patient }) {
      // define association here
      this.belongsTo(Role, {
        foreignKey: "role_id",
        targetKey: "id",
        as: "role",
      });

      this.belongsTo(Doctor, {
        foreignKey: "user_id",
        targetKey: "user_id",
      });

      this.belongsTo(Patient, {
        foreignKey: "user_id",
        targetKey: "user_id",
      });
    }
  }
  User.init(
    {
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: identifier(),
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "/images/profile.png",
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true,
    }
  );
  return User;
};
