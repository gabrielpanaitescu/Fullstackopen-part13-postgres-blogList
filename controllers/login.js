const router = require("express").Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");
const Session = require("../models/session");

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

    const session = await user.createSession();

    const userForToken = {
      userId: user.id,
      username: user.username,
      sessionId: session.id,
    };
    const token = jwt.sign(userForToken, SECRET, {
      expiresIn: "2h",
    });

    res.json({ username: user.username, name: user.name, token });
  } else {
    res.status(401).json({ error: "incorrect user or password" });
  }
});

module.exports = router;
