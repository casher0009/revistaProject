const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const passport = require("passport");
const multer = require("multer");
// const upload = multer({ dest: "./public/assets" });
const User = require("../models/User");
const uploadCloud = require("../helpers/cloudinary");


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect("/login?next=/profile");
}

//NEW
router.get("/newEvent", isLoggedIn, (req, res, next) => {
  res.render("events/newEvent");
});

router.post("/newEvent", uploadCloud.single("photo"), (req, res, next) => {
  if (req.file) {
    req.user.photoURL = req.file.url;
    req.body.aportedBy = req.user._id;
    Event.create(req.body)
      .then(event =>
        User.findByIdAndUpdate(req.user._id, { $push: { events: event._id } })
      )
      .then(res.redirect("/events"))
      .catch(e => {
        console.log(e);
      });
  } else {
    req.body.aportedBy = req.user._id;
    Event.create(req.body)
      .then(event =>
        User.findByIdAndUpdate(req.user._id, { $push: { events: event._id } })
      )
      .then(res.redirect("/events"))
      .catch(e => {
        console.log(e);
      });
  }
});

router.get("/events", (req, res) => {
  Event.find()
    .then(event => {
      res.render("events/events", { event });
    })
    .catch(e => {
      console.log(e);
    });
});

router.get("/events/:id", (req, res) => {
  const user = req.user;
  Event.findById(req.params.id)
    .populate("aportedBy")
    .then(event => {
      let ctx = { event };
      if (user._id.toString() === event.aportedBy._id.toString())
        ctx = { event, user };

      res.render("events/eventDetail", ctx);
    })
    .catch(e => {
      console.log(e);
    });
});

router.get("/remove/:id", (req, res) => {
  Promise.all([
    Event.findByIdAndRemove(req.params.id),
    User.findOneAndUpdate(
      { events: req.params.id },
      { $pull: { events: req.params.id } },
      { new: true }
    )
  ])
    .then(results => {
      res.redirect("/events");
    })
    .catch(e => {
      console.log(e);
    });
});

module.exports = router;
