const { tokenExtractor, verifySession } = require("../util/middleware");

const router = require("express").Router();

router.delete("/", tokenExtractor, verifySession, async (req, res) => {
  await req.session.destroy();

  res.status(204).end();
});

module.exports = router;
