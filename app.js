var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

// init database
const mongoose = require('mongoose')
const mongoURL = `mongodb://${process.env.RUNS_IN_DOCKER ? 'mongo' : 'localhost'}/home`
mongoose.connect(mongoURL, { useNewUrlParser: true })
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.Promise = global.Promise

require('./models/payment-model.js')

const apiRouter = require('./routes/api')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
