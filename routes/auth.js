const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const uploadCloud = require("../helpers/cloudinary");
const sendActivationLink = require('../helpers/mailer').sendActivationLink;

//funciones de Autenticacion

const errDict = {
  UserExistsError: "Este usuario ya existe"
};

function isAuth(req, res, next) {
  if (req.isAuthenticated()) return res.redirect("/profile");
  return next();
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect("/login");
}

//para cambiar la foto de perfil y el photoURL
router.post(
  "/profile",
  isLoggedIn,
  uploadCloud.single("foto"),
  (req, res, next) => {
    if (!req.file) redirect("/profile");
    req.user.photoURL = req.file.url;
    User.findOneAndUpdate(req.user._id, req.user, { new: true })
      .then(user => {
        res.redirect("/profile");
      })
      .catch(e => next(e));
  }
);

router.get("/profile", isLoggedIn, (req, res, next) => {
    User.findById(req.user._id)
    .populate("places", "events")
    .then(both => {
      res.render("profile", both);
    })
    .catch(e => {
      console.log(e);
    });
});

//Ruta para cambiar al usuario por activo
// router.get("/activation", isLoggedIn, (req, res, next) => {
//   User.findByIdAndUpdate(req.user._id, { active: true }, { new: true })
//     .then(user => {
//       res.send("Activado, gracias " + user.username)
//       setTimeout(res.redirect("/"),500);
//     })
//     .catch(e => next(e));
// });

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post('/signup', (req,res,next)=>{
    if(req.body.password !== req.body.password2){
        req.body.err = "Tu password no coincide"
        res.render('auth/signup', req.body)
    }
    User.register(req.body, req.body.password)
    .then(user=>{
        console.log('entraste')
        //activation link
        sendActivationLink(user);
        //loguearlo automaticamente
        res.redirect('/profile')
    })
    .catch(e => {
      req.body.err = errDict[e.name];
      res.render("auth/signup", req.body);
    });
});

//quitar funcion isAuth
router.get('/login' , (req,res,next)=>{
    res.render('auth/login', {next:req.query.next})
});

router.post("/login", passport.authenticate("local"), (req, res, next) => {
  if (req.body.next) res.redirect(req.body.next);
  req.app.locals.loggedUser = req.user;
  res.redirect("/profile");
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
