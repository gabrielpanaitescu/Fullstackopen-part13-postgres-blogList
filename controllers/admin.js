const router = require("express").Router();
const { User } = require("../models");
const { tokenExtractor, verifySession } = require("../util/middleware");

router.put(
  "/disable/:username",
  tokenExtractor,
  verifySession,
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
    console.log("sessions", sessions);
    sessions.forEach(async (session) => await session.destroy());
    console.log("sessions", sessions);

    await targetUser.save();
    res.json({ targetUser });
  }
);

module.exports = router;
