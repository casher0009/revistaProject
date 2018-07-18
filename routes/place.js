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
  res.render("places/newPlace");
});

router.post("/newPlace", upload.single("photo"), (req, res, next) => {
  if (req.file) {
    req.body.photoURL = "/assets/" + req.file.filename;
    req.body.aportedBy = req.user._id;
    Place.create(req.body)
      .then(place =>
        User.findByIdAndUpdate(req.user._id, { $push: { places: place._id } })
      )
      .then(res.redirect("/places"))
      .catch(e => {
        console.log(e);
      });
  } else {
    req.body.aportedBy = req.user._id;
    Place.create(req.body)
      .then(place =>
        User.findByIdAndUpdate(req.user._id, { $push: { places: place._id } })
      )
      .then(res.redirect("/places"))
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
  Place.findById(req.params.id)
    .populate("aportedBy")
    .then(place => {
      let ctx = {place}
      console.log(user._id.toString())
      console.log("espacio")
      console.log (place.aportedBy._id.toString())
      if(user._id.toString() === place.aportedBy._id.toString())
      ctx = {place,user}
      
      res.render("places/placeDetail", ctx);
    })
    .catch(e => {
      console.log(e);
    });
});

router.get("/remove/:id", (req, res) => {
  
  Place.findByIdAndRemove(req.params.id)
  
    .then(res.redirect("/places"))
    .catch(e => {
      console.log(e);
    });
});

module.exports = router;
