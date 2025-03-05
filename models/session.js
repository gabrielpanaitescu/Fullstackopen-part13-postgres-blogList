const { sequelize } = require("../util/db");
const { DataTypes, Model } = require("sequelize");

class Session extends Model {}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // commented out to test: foreignKey will automatically be userId due to the one to one link in models/index.js
    // userId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "users",
    //     key: "id",
    //   },
    // },
  },
  {
    sequelize,
    timestamps: true,
    updatedAt: false,
    underscored: true,
    modelName: "session",
  }
);

module.exports = Session;
