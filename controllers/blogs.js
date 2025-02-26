const blogsRouter = require("express").Router();

const { Blog } = require("../models");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const blog = await Blog.create(req.body);
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

blogsRouter.delete("/:id", blogFinder, async (req, res) => {
  const blog = req.blog;

  if (blog) {
    await blog.destroy();
  }

  res.status(204).end();
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
