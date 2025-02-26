const { Sequelize } = require("sequelize");
const { DATABASE_URL } = require("../util/config");

const sequelize = new Sequelize(DATABASE_URL);

const connectToDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to DB established successfully");
  } catch (error) {
    console.log(`Error connecting to DB: ${error}`);
    return process.exit(1);
  }

  return null;
};

module.exports = {
  sequelize,
  connectToDb,
};
