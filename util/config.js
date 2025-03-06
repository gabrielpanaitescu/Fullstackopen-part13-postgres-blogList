require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3002,
  DATABASE_URL: process.env.DATABASE_URL,
  SECRET: process.env.SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION,
};
