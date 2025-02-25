const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL);

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection successful");
    await sequelize.close();
  } catch (error) {
    console.log("Could not connect to DB");
  }
};

main();

module.exports = {
  sequelize,
};
