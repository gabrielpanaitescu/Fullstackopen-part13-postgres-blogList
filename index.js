const express = require("express");
require("express-async-errors");
const { errorMiddleware, unknownEndpoint } = require("./util/middleware");
const app = express();
const blogsRouter = require("./controllers/blogs");

const { PORT } = require("./util/config");
const { connectToDb } = require("./util/db");

// app.use(express.json());

app.use("/api/blogs", blogsRouter);

app.use(unknownEndpoint);
app.use(errorMiddleware);

const start = async () => {
  await connectToDb();
  app.listen(PORT, () => {
    console.log(`App started listening at PORT ${PORT}`);
  });
};

start();
