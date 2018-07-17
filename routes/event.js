const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const passport = require("passport");
const multer = require("multer");
const upload = multer({ dest: "./public/assets" });
const User = require("../models/User");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect("/login?next=/profile");
}

//NEW
router.get("/newEvent", isLoggedIn, (req, res, next) => {
  res.render("events/newEvent");
});

router.post("/newEvent", upload.single("photo"), (req, res, next) => {
  if (req.file) {
    req.body.photoURL = "/assets/" + req.file.filename;
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
  Event.findById(req.params.id)
    .populate("aportedBy")
    .then(event => {
      res.render("events/eventDetail", event);
    })
    .catch(e => {
      console.log(e);
    });
});

module.exports = router;
