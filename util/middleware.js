const { SECRET } = require("../util/config");
const jwt = require("jsonwebtoken");

const errorMiddleware = async (err, req, res, next) => {
  console.log(
    "Error Middleware: ",
    "Error.name:",
    err.name,
    "Error:",
    err.message
  );
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeDatabaseError"
  ) {
    return res.status(400).json({ error: err.message });
  } else if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    return res.status(400).json({ error: err.message });
  } else if (err.message) {
    return res
      .status(400)
      .json({ error: `Unnamed error caught in middleware: ${err}` });
  }

  next(err);
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.decodedToken = jwt.verify(authorization.split(" ")[1], SECRET);
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
};

module.exports = {
  errorMiddleware,
  unknownEndpoint,
  tokenExtractor,
};
