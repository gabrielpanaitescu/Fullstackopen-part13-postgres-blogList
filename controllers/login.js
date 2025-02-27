const router = require("express").Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");

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
    const userForToken = {
      id: user.id,
      username: user.username,
    };
    const token = jwt.sign(userForToken, SECRET, {
      // expiresIn: "5s",
    });

    res.json({ username: user.username, name: user.name, token });
  } else {
    res.status(401).json({ error: "incorrect user or password" });
  }
});

module.exports = router;
