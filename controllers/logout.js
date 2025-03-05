const { getUserFromToken } = require("../util/middleware");

const router = require("express").Router();

router.delete("/", getUserFromToken, async (req, res) => {
  await req.session.destroy();

  res.status(204).end();
});

module.exports = router;
