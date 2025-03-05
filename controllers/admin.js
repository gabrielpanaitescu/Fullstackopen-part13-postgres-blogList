const router = require("express").Router();
const { User } = require("../models");
const { getUserFromToken } = require("../util/middleware");

router.put(
  "/disable/:username",
  getUserFromToken,

  async (req, res) => {
    const user = req.user;
    if (!user.admin) return res.status(401).json({ error: "access denied" });

    const { username } = req.params;
    const targetUser = await User.findOne({
      where: {
        username,
      },
    });

    targetUser.disabled = req.body.disabled;

    const sessions = await targetUser.getSessions();
    sessions.forEach(async (session) => await session.destroy());

    await targetUser.save();
    res.json({ targetUser });
  }
);

module.exports = router;
