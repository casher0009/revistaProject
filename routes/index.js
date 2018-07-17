const express = require('express');
const router  = express.Router();

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
router.get('/', (req, res, next) => {
  res.render('index');
});

/* GET search page */
router.get('/search', (req, res, next) => {
  res.render('search');
});

/* GET profile page */ 
router.get('/profile',isLoggedIn, (req, res, next) => {
  res.render('profile');
});

/* GET contact page */
router.get('/contact', (req, res, next) => {
  res.render('contact');
});

/* GET books page */
router.get('/books', (req, res, next) => {
  res.render('books');
});

/* GET places page */
router.get('/places', (req, res, next) => {
  res.render('places');
});

/* GET events page */
router.get('/events', (req, res, next) => {
  res.render('events');
});

module.exports = router;