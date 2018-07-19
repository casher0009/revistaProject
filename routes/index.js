const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Place = require("../models/Place");

//Funcion esta logeado?
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect("/login?next=/activation");
}
function isAuth(req, res, next) {
  if (req.isAuthenticated()) return res.redirect("/profile");
  return next();
}

/* GET home page */
router.get("/", (req, res, next) => {
  Promise.all([
    Event.find()
      .sort({ date: -1 })
      .limit(9),
    Place.find()
      .limit(9)
      .populate("aportedBy")
  ])
    .then(results => {
      const ctx = {
        events: results[0],
        places: results[1]
      };
      res.render("index", ctx);
    })
    .catch(e => console.log(e));
});

/* GET search page */
router.get("/search", (req, res, next) => {
  res.render("search");
});

router.post("/search", (req, res, next) => {
  console.log(req.body.placeName);

  const PlacePromise = Place.find({placeName: { $regex: req.body.placeName, $options: "i" }})
  const EventPromise = Event.find({eventName: { $regex: req.body.placeName, $options: "i" }})
  Promise.all([
    PlacePromise,EventPromise])
    .then(results => {
      console.log(req.body.placeName, "EEEEEEEsta chingadera");
      console.log(results);
      const ctx = {
        places: results[0],
        events: results[1]
      };
      res.render("search", ctx);
    })
    .catch(e => next(e));
});

// /* GET profile page */
// router.get('/profile',isLoggedIn, (req, res, next) => {
//   res.render('profile');
// });

/* GET contact page */
router.get("/contact", (req, res, next) => {
  res.render("contact");
});

/* GET places page */
router.get("/places", (req, res, next) => {
  res.render("places");
});

/* GET events page */
router.get("/events", (req, res, next) => {
  res.render("events");
});

module.exports = router;
