const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const moment = require('moment')

const PaymentSchema = new mongoose.Schema({
  // id field is not used, as I use Mongoose ObjectIds _id (uuids) and let Mongoose take care of this.
  contractId: {
    type: Number,
    index: true,
    required: true
  },
  description: {
    type: String
  },
  value: {
    type: Number,
    required: true
  },
  time: { // according to usage and database-size, one might place an index here to speed up the getPaymentsForContractBetween queries
    type: Date,
    required: true
  },
  isImported: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: () => { return new Date() }
  },
  createdAt: {
    type: Date,
    default: () => { return new Date() }
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
})

// sample Data object:
// {
//   "id": 1365,
//   "contractId": 17689,
//   "description": "Rent to be paid",
//   "value": -100,
//   "time": "2016-12-09T00:00:00.00Z",
//   "isImported": false,
//   "createdAt": "2016-12-09T12:57:09.708Z",
//   "updatedAt": "2016-12-09T12:57:09.709Z",
//   "isDeleted": false
// }

function findInputErrorsInPaymentUpdate (contractId, data) {
  let errors = []
  if (typeof contractId !== 'string') errors.push('Parameter "contractId" must be of type String')
  if (typeof data.description !== 'string') errors.push('Field "description" must be of type String')
  if (typeof data.value !== 'number') errors.push('Field "value" to must be of type Number')
  if (!moment(data.time).isValid()) errors.push('Field "time" to must be a valid Date (eg: "2016-12-09T00:00:00.00Z")')
  if (typeof data.isImported !== 'boolean') errors.push('Field "isImported" to must be of type Boolean')
  if (typeof data.isDeleted !== 'boolean') errors.push('Field "isImported" to must be of type Boolean')
  return errors.length === 0 ? false : errors
}

PaymentSchema.statics.getPaymentsForContractBetween = function (contractId, startDate, endDate, callback) {
  function findInputErrors (contractId, startDate, endDate) {
    let errors = []
    if (typeof contractId !== 'string') errors.push('Parameter "contractId" must be of type String')
    if (!/\d/.test(startDate)) errors.push('Parameter "from" must be of type Number (timestamp in milliseconds)')
    if (!/\d/.test(endDate)) errors.push('Parameter to "must" be of type Number (timestamp in milliseconds)')
    return errors.length === 0 ? false : errors
  }

  function getSum (docs) {
    let sum = 0
    docs.forEach(doc => {
      sum = sum + doc.value
    })
    return sum
  }

  let inputErrors = findInputErrors(contractId, startDate, endDate)

  if (!inputErrors) {
    const Payment = mongoose.model('Payment')
    Payment.find({
      'contractId': contractId,
      'time': {
        $gt: moment.unix(startDate),
        $lte: moment.unix(endDate)
      }
    }).exec(async (err, docs) => {
      if (err) {
        console.log(`error finding payments: ${err}`)
        callback(err, null)
      } else {
        console.log(`found ${docs.length} payments`)
        let result = await {
          sum: getSum(docs),
          items: docs
        }
        callback(err, result)
      }
    })
  } else {
    callback(inputErrors, null)
  }
}

PaymentSchema.statics.addPayment = function (contractId, data, callback) {
  const Payment = mongoose.model('Payment')

  let inputErrors = findInputErrorsInPaymentUpdate(contractId, data)

  if (!inputErrors) {
    let payment = {
      contractId: contractId,
      description: data.description,
      value: data.value,
      time: data.time,
      isImported: data.isImported,
      isDeleted: data.isDeleted
    }
    new Payment(payment).save((err, doc) => {
      if (err) {
        console.log(`error adding payment: ${err}`)
        callback(err, null)
      } else {
        console.log(`payment added.`)
        callback(err, doc)
      }
    })
  } else {
    callback(inputErrors, null)
  }
}

PaymentSchema.statics.updatePayment = function (contractId, paymentId, data, callback) {
  const Payment = mongoose.model('Payment')

  let inputErrors = findInputErrorsInPaymentUpdate(contractId, data)

  if (!inputErrors) {
    Payment.findOne({ _id: paymentId }).then(result => {
      if (result) {
        // result.contractId = data.contractId, // this operation assigns another contractId; disabled as boundaries between customers should be preserved.
        result.description = data.description
        result.value = data.value
        result.time = data.time
        result.isImported = data.isImported
        result.isDeleted = data.isDeleted
        result.updatedAt = new Date()
      }
      result.save((err, doc) => {
        if (err) {
          console.log(`error updating payment: ${err}`)
          callback(err, null)
        } else {
          console.log(`payment updated.`)
          callback(err, doc)
        }
      })
    })
  } else {
    callback(inputErrors, null)
  }
}

PaymentSchema.statics.deletePayment = function (contractId, paymentId, callback) {
  const Payment = mongoose.model('Payment')
  Payment.findOne({ _id: paymentId }).remove((err, doc) => {
    if (err) {
      console.log(`error deleting payment: ${err}`)
      callback(err, null)
    } else {
      console.log(`payment deleted.`)
      callback(err, doc)
    }
  })
}

mongoose.model('Payment', PaymentSchema)
