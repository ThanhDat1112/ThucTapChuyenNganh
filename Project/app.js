var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { engine } = require('express-handlebars');

var app = express();

// ===== ROUTES =====
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

// ===== VIEW ENGINE SETUP =====
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'layouts', // file trong views/layouts/layouts.hbs
    partialsDir: path.join(__dirname, 'views', 'partials'),
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// ===== MIDDLEWARE =====
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ===== ROUTES =====
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// ===== 404 ERROR HANDLER =====
app.use(function(req, res, next) {
    next(createError(404));
});

// ===== GENERAL ERROR HANDLER =====
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
