const blogsRouter = require("express").Router();
const { Op } = require("sequelize");
const { Blog, User } = require("../models");
const { tokenExtractor } = require("../util/middleware");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

blogsRouter.get("/", async (req, res) => {
  const where = {};

  if (req.query.search)
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
    ];

  const blogs = await Blog.findAll({
    attributes: {
      exclude: ["userId"],
    },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

blogsRouter.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
    date: new Date(),
  });
  res.status(201).json(blog);
});

blogsRouter.get("/:id", blogFinder, async (req, res) => {
  const blog = req.blog;

  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

blogsRouter.delete("/:id", tokenExtractor, blogFinder, async (req, res) => {
  const blog = req.blog;

  if (!blog) return res.status(204).end();

  const user = await User.findByPk(req.decodedToken.id);
  const isBlogAddedByLoggedUser = blog.userId === user.id;

  if (isBlogAddedByLoggedUser) {
    await blog.destroy();
    res.status(204).end();
  } else {
    res.status(401).json({ error: "target blog is not added by logged user" });
  }
});

blogsRouter.put("/:id", blogFinder, async (req, res) => {
  const blog = req.blog;

  if (blog) {
    blog.likes = req.body.likes;
    await blog.save();
    res.json({ likes: blog.likes });
  } else {
    res.status(404).end();
  }
});

module.exports = blogsRouter;
