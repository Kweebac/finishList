const express = require("express");
const router = express.Router();
const Player = require("../models/player");
const { body, validationResult } = require("express-validator");
const Finish = require("../models/finish");

router.get("/", async (req, res, next) => {
  try {
    const players = await Player.aggregate([
      {
        $project: {
          username: 1,
          finishes: 1,
          length: { $size: "$finishes" },
        },
      },
      { $sort: { length: -1 } },
    ]).exec();

    res.render("playerList", {
      players,
    });
  } catch (error) {
    return next(error);
  }
});
router.get("/create", async (req, res, next) => {
  try {
    const finishes = await Finish.find().sort({ finishing: 1, cosmetic: 1 }).exec();

    res.render("playerCreate", {
      player: undefined,
      finishes,
      errors: [],
    });
  } catch (error) {
    return next(error);
  }
});
router.post("/create", [
  body("username")
    .escape()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .matches(/^\w*$/)
    .withMessage("Username must only contain alphanumeric characters or underscores"),
  body("discord", "Discord must be at least 2 characters")
    .escape()
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2 }),
  body("finishes.*").escape(),

  async (req, res, next) => {
    try {
      let player;
      if (req.body.discord) {
        player = new Player({
          username: req.body.username,
          discord: req.body.discord,
          finishes: req.body.finishes,
        });
      } else {
        player = new Player({
          username: req.body.username,
          finishes: req.body.finishes,
        });
      }

      const finishes = await Finish.find().sort({ finishing: 1, cosmetic: 1 }).exec();
      for (const finish of finishes)
        if (player.finishes.includes(finish._id)) finish.checked = "true";

      let errors = validationResult(req);
      if (errors.isEmpty()) {
        const playerExists = await Player.find({ username: req.body.username })
          .collation({ locale: "en", strength: 2 })
          .exec();

        if (playerExists.length) {
          errors = errors.array();
          errors.push({
            msg: "Player already created",
          });

          res.render("playerCreate", {
            player,
            finishes,
            errors,
          });
        } else {
          player.save();
          res.redirect(`/players/${player._id}`);
        }
      } else {
        res.render("playerCreate", {
          player,
          finishes,
          errors: errors.array(),
        });
      }
    } catch (error) {
      return next(error);
    }
  },
]);
router.get("/:id", async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.id).populate("finishes").exec();

    res.render("playerId", {
      player,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
