const { sequelize } = require("../util/db");
const { DataTypes, Model } = require("sequelize");

class ReadingList extends Model {}

ReadingList.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "blogs",
        key: "id",
      },
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: "reading_list",
    timestamps: false,
  }
);

module.exports = ReadingList;
