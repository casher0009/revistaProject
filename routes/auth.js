const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

const errDict = {
    UserExistsError: "Este usuario ya existe"
}
router.get('/signup', (req,res,next)=>{
    res.render('auth/signup')
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
        //sendActivationLink(user);
        //loguearlo automaticamente
        res.redirect('/')
    })
    .catch(e=>{
        req.body.err = errDict[e.name];
        res.render('auth/signup', req.body)
    });
});

router.get('/login', (req,res,next)=>{
    res.render('auth/login', {next:req.query.next})
});

router.post('/login', passport.authenticate('local'), (req,res,next)=>{
    if(req.body.next) res.redirect(req.body.next);
    req.app.locals.loggedUser = req.user;
    res.redirect('/profile')
});

router.get('/logout', (req,res,next)=>{
    req.logout();
    res.redirect('/')
});

module.exports = router;