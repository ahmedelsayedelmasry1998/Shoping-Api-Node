var createError = require('http-errors');
var express = require('express');

//Using Built In Module
const path = require("path");
//Using Built In Module

var logger = require('morgan');
const cors = require("cors");
const mongoose  = require("mongoose");

mongoose.connect("mongodb://localhost/Shoping-Api").then((succes)=>{
  console.log("Connecting To Database...");
}).catch((err)=>{
console.log(err);
});



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
const orderRouter =  require("./routes/order");


var app = express();

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use(logger('dev'));

//Using Cors
app.use(cors());
//Using Cors

//This Code To Use productImage Folder In All Routes
app.use(express.static(path.join(__dirname,"productImage")));
//This Code To Use productImage Folder In All Routes


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productRouter);

//Using Order
app.use('/order', orderRouter);
//Using Order

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
  res.json({message : err.message});
});

module.exports = app;
