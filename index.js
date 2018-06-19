// Lib imports
var express       = require('express');
var session       = require('express-session');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var morgan        = require('morgan');
var passport      = require('passport');
var flash         = require('connect-flash');

var Config = require('./config');

require('./config/passport')(passport);
var app = express();
var port  = process.env.port || 8080;

app.use(morgan('dev')); 
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(session({
  secret: Config.secret,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

app.listen(port);
console.log("Listning on port " + port);


