const { Session, User } = require("../models");
const jwt = require("jsonwebtoken");
const { SECRET, JWT_EXPIRATION } = require("../util/config");
const router = require("express").Router();

router.post("/", async (req, res) => {
  const { refreshId } = req.body;

  if (!refreshId)
    return res.status(401).json({ error: "Missing refresh token" });

  const session = await Session.findOne({
    where: {
      refreshId,
    },
    include: {
      model: User,
      attributes: {
        exclude: ["passwordHash"],
      },
    },
  });

  if (session) {
    if (!Session.verifyRefreshExpiration(session)) {
      const payload = {
        userId: session.userId,
        username: session.user.username,
        sessionId: session.id,
      };

      const newToken = jwt.sign(payload, SECRET, {
        expiresIn: JWT_EXPIRATION,
      });

      res.json({
        username: session.user.username,
        name: session.user.name,
        newToken,
      });
    } else {
      await session.destroy();
      res
        .status(401)
        .json({ error: "Refresh token expired. Please login again" });
    }
  } else {
    res
      .status(401)
      .json({ error: "No session found for the refreshId provided" });
  }
});

module.exports = router;
