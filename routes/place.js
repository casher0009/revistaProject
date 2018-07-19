const express = require("express");
const router = express.Router();
const Place = require("../models/Place");
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
router.get("/newPlace", isLoggedIn, (req, res, next) => {
  res.render("places/newPlace");
});

router.post("/newPlace", uploadCloud.single("photo"), (req, res, next) => {
  if (req.file) {
    req.user.photoURL = req.file.url;
    req.body.aportedBy = req.user._id;
    Place.create(req.body)
      .then(place =>
        User.findByIdAndUpdate(req.user._id, { $push: { places: place._id } })
      )
      .then(res.redirect("/profile"))
      .catch(e => {
        console.log(e);
      });
  } else {
    req.body.aportedBy = req.user._id;
    Place.create(req.body)
      .then(place =>
        User.findByIdAndUpdate(req.user._id, { $push: { places: place._id } })
      )
      .then(res.redirect("/profile"))
      .catch(e => {
        console.log(e);
      });
  }
});

router.get("/places", (req, res) => {
  Place.find()
    .then(place => {
      res.render("places/places", { place });
    })
    .catch(e => {
      console.log(e);
    });
});

router.get("/places/:id", (req, res) => {
  const user = req.user;
  console.log(user)
  if (user === undefined){
    Place.findById(req.params.id)
    .then(place => {
      res.render("places/placeDetail", {place});
    });
  } else{
    Place.findById(req.params.id)
      .populate("aportedBy")
      .then(place => {
        let ctx = { place };
        if (user._id.toString() === place.aportedBy._id.toString())
          ctx = { place, user };

        res.render("places/placeDetail", ctx);
      })
      .catch(e => {
        console.log(e);
      });
  }
});

router.get("/remove/:id", (req, res) => {
  Promise.all([
    Place.findByIdAndRemove(req.params.id),
    User.findOneAndUpdate(
      { places: req.params.id },
      { $pull: { places: req.params.id } },
      { new: true }
    )
  ])
    .then(results => {
      res.redirect("/places");
    })
    .catch(e => {
      console.log(e);
    });
});

module.exports = router;
