const router = require("express").Router();
const { User, Session } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET, JWT_EXPIRATION } = require("../util/config");

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username,
    },
  });

  const passwordCorrect =
    user && password ? await bcrypt.compare(password, user.passwordHash) : null;

  if (passwordCorrect) {
    if (user.disabled)
      return res
        .status(401)
        .json({ error: "user is disabled, please contact an admin" });

    // const session = await user.createSession();
    const session = await Session.createSession(user.id);

    const payload = {
      userId: user.id,
      username: user.username,
      sessionId: session.id,
    };
    const token = jwt.sign(payload, SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    res.json({
      username: user.username,
      name: user.name,
      token,
      refreshId: session.refreshId,
    });
  } else {
    res.status(401).json({ error: "incorrect user or password" });
  }
});

module.exports = router;
