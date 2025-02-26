const express = require("express");
const app = express();
const blogsRouter = require("./controllers/blogs");

const { PORT } = require("./util/config");
const { connectToDb } = require("./util/db");

app.use(express.json());

app.use("/api/blogs", blogsRouter);

const start = async () => {
  await connectToDb();
  app.listen(PORT, () => {
    console.log(`App started listening at PORT ${PORT}`);
  });
};

start();
