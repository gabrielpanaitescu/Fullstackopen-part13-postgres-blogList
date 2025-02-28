const router = require("express").Router();
const { Blog } = require("../models");
const { sequelize } = require("../util/db");

router.get("/", async (req, res) => {
  const blogsByAuthors = await Blog.findAll({
    group: "author",
    attributes: [
      "author",
      [sequelize.fn("COUNT", sequelize.col("title")), "blogCount"],
      [sequelize.fn("SUM", sequelize.col("likes")), "totalLikes"],
    ],
    order: [[sequelize.fn("SUM", sequelize.col("likes")), "DESC"]],
  });

  res.json(blogsByAuthors);
});

module.exports = router;
