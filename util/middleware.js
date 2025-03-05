const { SECRET } = require("../util/config");
const jwt = require("jsonwebtoken");
const Session = require("../models/session");
const { User } = require("../models");

const errorMiddleware = async (err, req, res, next) => {
  console.log("Error Middleware -> ");
  console.log("!!!!Error.name!!!!!", err.name);
  console.log("!!!! Complete Error!!!!!!!", err);
  if (err.name === "SequelizeValidationError") {
    const errMessages = err.errors.map((error) => error.message);
    return res.status(400).json({ error: errMessages });
  } else if (err.name === "SequelizeDatabaseError") {
    return res.status(400).json({ error: err.message });
  } else if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    return res.status(400).json({ error: err.message });
  } else if (err.name === "SessionError") {
    return res.status(401).json({ error: err.message });
  } else if (err.message) {
    return res
      .status(400)
      .json({ error: `Unhandled error caught in middleware: ${err}` });
  }

  next(err);
};

const verifySession = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.userId);
  const session = await Session.findOne({
    where: { id: req.decodedToken.sessionId, userId: req.decodedToken.userId },
  });

  if (!session) {
    const error = new Error("Invalid login session");
    error.name = "SessionError";
    throw error;
  }

  req.user = user;
  req.session = session;

  next();
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
  verifySession,
};
