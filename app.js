require('dotenv').config();
const lcl = require('cli-color');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const path = require("path");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const express = require('express');

// global express
const app = express();

// express middlewares
app.use(compression());
app.use(cors());
app.use(morgan('dev'));
app.use(favicon(path.join(__dirname, "static", "favicon.ico")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// express routes
app.use('/api', require('./api/router'));

// express error handler
app.use((req, res, next) => {
    const error = new Error("Page not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    // Don't show stack trace in production
    var errorStatus = error.status || 500;
    var errorMessage = "Internal server error";
    if (errorStatus === 500) {
        if (process.env.NODE_ENV === "development") {
            errorMessage = error.message;
        }
    } else {
        errorMessage = error.message;
    }

    res.status(errorStatus).json({
        "success": false,
        "message": errorMessage,
    });
});


// start express server
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(lcl.blue("[Express - Info]"), "Started on port", lcl.yellow(port));
});