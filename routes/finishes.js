const express = require("express");
const router = express.Router();
const Finish = require("../models/finish");

router.get("/", async (req, res, next) => {
  try {
    const finishes = await Finish.aggregate([
      {
        $project: {
          cosmetic: 1,
          finishing: 1,
          players: 1,
          length: { $size: "$players" },
        },
      },
      { $sort: { length: 1 } },
    ]).exec();

    res.render("finishList", {
      finishes,
    });
  } catch (error) {
    return next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const finish = await Finish.findById(req.params.id).populate("players").exec();

    res.render("finishId", {
      finish,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
