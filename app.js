const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoute = require('./api/routes/post');

mongoose.set("strictQuery",false);
mongoose.connect('mongodb://localhost:27017/node-post-demo');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use('/posts', postRoute);

app.use((req,res,next) => {
    const error = new Error('data not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error :{
            message: error.message,
        }
    });
});

module.exports = app;