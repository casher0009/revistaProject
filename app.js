process.setMaxListeners(0);
require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      =  require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('./helpers/passport');


mongoose.Promise = Promise;
mongoose.connect(process.env.DBHEROKU, {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err) 
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

app.use(session({
  store: new MongoStore({
    mongooseConnection:mongoose.connection,
    ttl:24*60*60
  }),
  secret: 'bliss',
  saveUninitialized: true,
  resave: true,
  // cookie: {
  //     path: "/",
  // }
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Un título chingón';
//Eventos
const event = require('./routes/event');
app.use('/', event);

//LUGARES
const place = require('./routes/place');
app.use('/', place);

const index = require('./routes/index');
app.use('/', index);
const auth = require('./routes/auth');
app.use('/', auth);

module.exports = app;
