const express = require("express");
const router = express.Router();
const Place = require("../models/Place");
const passport = require("passport");
const multer = require("multer");
const upload = multer({ dest: "./public/assets" });
const User = require("../models/User");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect("/login?next=/profile");
}

//NEW
router.get("/newPlace", isLoggedIn, (req, res, next) => {
  res.render("newPlace");
});

router.post("/newPlace", upload.single("photo"), (req, res, next) => {
  if (req.file) {
    req.body.photoURL = "/assets/" + req.file.filename;
    req.body.aportedBy = req.user._id;
    Place.create(req.body)
      .then(place =>
        User.findByIdAndUpdate(req.user._id, { $push: { places: place._id } })
      )
      .then(res.redirect("/listPlace"))
      .catch(e => {
        console.log(e);
      });
  } else {
    req.body.aportedBy = req.user._id;
    Place.create(req.body)
      .then(place =>
        User.findByIdAndUpdate(req.user._id, { $push: { places: place._id } })
      )
      .then(res.redirect("/listPlace"))
      .catch(e => {
        console.log(e);
      });
  }
});

router.get("/listPLace", (req, res) => {
  Place.find()
    .then(place => {
      res.render("listPlace", { place });
    })
    .catch(e => {
      console.log(e);
    });
});

router.get("/listPlace/:id", (req, res) => {
  Place.findById(req.params.id)
    .then(place => {
      res.render("placeDetail", place);
    })
    .catch(e => {
      console.log(e);
    });
});

module.exports = router;
