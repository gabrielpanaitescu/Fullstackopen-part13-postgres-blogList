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
  } else if (err.message) {
    return res
      .status(400)
      .json({ error: `Unhandled error caught in middleware: ${err}` });
  }

  next(err);
};

const getUserFromToken = async (req, res, next) => {
  const authorization = req.get("authorization");
  let token;

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    token = jwt.verify(authorization.split(" ")[1], SECRET);
  } else {
    return res.status(401).json({ error: "token missing" });
  }

  const user = await User.findByPk(token.userId, {
    include: {
      required: false,
      model: Session,
      where: {
        id: token.sessionId,
      },
    },
  });
  const session = user.sessions[0];

  if (!session) {
    return res.status(401).json({ error: "Invalid login session" });
  }

  if (user.disabled)
    return res
      .status(401)
      .json({ error: "user is disabled, please contact an admin" });

  req.user = user;
  req.session = session;
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
};

module.exports = {
  errorMiddleware,
  unknownEndpoint,
  getUserFromToken,
};
