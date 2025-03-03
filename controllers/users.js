const router = require("express").Router();
const { User, Blog } = require("../models");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: {
      exclude: ["passwordHash"],
    },
    include: {
      model: Blog,
      attributes: {
        exclude: ["userId"],
      },
    },
  });

  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: [
      { model: Blog, attributes: { exclude: ["userId"] } },
      {
        model: Blog,
        as: "marked_blogs",
        attributes: {
          exclude: ["userId"],
        },
        through: {
          attributes: ["id", "read"],
        },
      },
    ],
  });

  if (user) {
    res.json({ user });
  } else {
    res.status(404).end();
  }
});

router.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  if (!password || !(password.length <= 4))
    return res
      .status(400)
      .json({ error: "password must be at least 4 characters longs" });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    name,
    username,
    passwordHash,
  });

  res.status(201).json({ name: user.name, username: user.username });
});

router.put("/:username", async (req, res) => {
  const { username } = req.params;
  const { updatedUsername } = req.body;

  const user = await User.findOne({
    where: {
      username,
    },
    attributes: ["id", "username"],
  });

  if (user) {
    await user.update({ username: updatedUsername });
    res.json({ user });
  } else {
    res.status(400).json({ error: "user not found" });
  }
});

module.exports = router;
