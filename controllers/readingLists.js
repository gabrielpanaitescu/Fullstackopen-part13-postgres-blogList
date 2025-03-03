const ReadingList = require("../models/readingList");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const { userId, blogId } = req.body;

  const result = await ReadingList.create({
    userId,
    blogId,
  });

  res.status(201).end();
});

module.exports = router;
