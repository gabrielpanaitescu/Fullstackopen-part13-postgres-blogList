const errorMiddleware = async (err, req, res, next) => {
  console.log(err.name, err.message);
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeDatabaseError"
  ) {
    res.status(400).json({ error: err.message });
  }

  next(err);
};

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
};

module.exports = {
  errorMiddleware,
  unknownEndpoint,
};
