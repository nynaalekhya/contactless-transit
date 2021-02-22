var express = require('express');


var createError = require('http-errors');

require('dotenv').config();

var session = require('express-session');
var flash = require('connect-flash');
var path = require('path');

const jwt = require('jsonwebtoken');
var logger = require('morgan');

require('isomorphic-fetch');
require('./passport-setup');


var cors = require('cors');
var app = express();
app.set('view engine', 'ejs');
var passport = require('passport');





const cookieParser = require('cookie-session');
const bodyParser = require('body-parser');





var stripe = require('stripe')('sk_test_51Gy73eClLD4CzLriwYEarFXd2FIEWJ8v9WgUVs0Vh9xwZ5va2ix7mcxsI9AUrwJDysGjsogz371ngN4k7eNJuP1R00RpPk5zxZ');





// Configure OIDC strategy


var indexRouter = require('./routes/index');


const { UserBindingContext } = require('twilio/lib/rest/chat/v2/service/user/userBinding');
var app = express();


// Flash middleware
app.use(flash());

// Set up local vars for template layout
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser({
    name: 'ses',
    keys: ['key1', 'key2']
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error.ejs', { text: 'An error has occurred' });
});



var port = process.env.PORT || 3000;
app.listen(port, console.log('listening at 3000'));