const { ReadingList } = require("../models");
const { tokenExtractor } = require("../util/middleware");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const { userId, blogId } = req.body;

  await ReadingList.create({
    userId,
    blogId,
  });

  res.status(201).end();
});

router.put("/:id", tokenExtractor, async (req, res) => {
  const readingListEntry = await ReadingList.findOne({
    where: {
      userId: req.decodedToken.id,
      blogId: Number(req.params.id),
    },
  });

  if (readingListEntry) {
    readingListEntry.read = req.body.read;
    await readingListEntry.save();
    res.json(readingListEntry);
  } else {
    res
      .status(403)
      .json({ error: "blog not found in the logged user's reading list" });
  }
});

module.exports = router;
