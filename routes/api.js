var express = require('express')
var router = express.Router()

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const Payment = mongoose.model('Payment')

// Fetch the list of payments above (which were made in a particular time frame)
router.get('/contract/:contractId/payment/from/:startDate/to/:endDate', function (req, res, next) {
  Payment.getPaymentsForContractBetween(req.params.contractId, req.params.startDate, req.params.endDate, (err, doc) => {
    if (err) {
      res.send(500, err)
    } else {
      res.json(doc).end()
    }
  })
})

// Add a new payment to a contract
router.post('/contract/:contractId/payment', function (req, res, next) {
  let update = req.body
  Payment.addPayment(req.params.contractId, update, (err, doc) => {
    if (err) {
      res.send(500, err)
    } else {
      res.json(doc).end()
    }
  })
})

// Update an existing payment
router.put('/contract/:contractId/payment/:paymentId', function (req, res, next) {
  let update = req.body
  Payment.updatePayment(req.params.contractId, req.params.paymentId, update, (err, doc) => {
    if (err) {
      res.send(500, err)
    } else {
      res.json(doc).end()
    }
  })
})

// Delete a payment
router.delete('/contract/:contractId/payment/:paymentId', function (req, res, next) {
  Payment.deletePayment(req.params.contractId, req.params.paymentId, (err, doc) => {
    if (err) {
      res.send(500, err)
    } else if (doc.n === 0) {
      console.log(`payment not found.`)
      res.send(404, 'payment not found')
    } else {
      res.json(doc).end()
    }
  })
})

module.exports = router
