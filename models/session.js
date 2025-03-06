const { JWT_REFRESH_EXPIRATION } = require("../util/config");
const { sequelize } = require("../util/db");
const { DataTypes, Model } = require("sequelize");

class Session extends Model {
  static async createSession(userId) {
    const expiresAt = new Date();

    expiresAt.setSeconds(
      expiresAt.getSeconds() + Number(JWT_REFRESH_EXPIRATION)
    );

    const session = await Session.create({
      userId: userId,
      expiryDate: expiresAt.getTime(),
    });

    return session;
  }

  static verifyRefreshExpiration(session) {
    return session.expiryDate.getTime() < new Date().getTime();
  }
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
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
    refreshId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
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
