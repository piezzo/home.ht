const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const moment = require('moment')

const PaymentSchema = new mongoose.Schema({
  // id field is abandoned, as I use Mongoose Object ids (uuids) and let Mongoose take care of this.
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
  time: {
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

PaymentSchema.statics.getPaymentsForContractBetween = function (contractId, startDate, endDate, callback) {
  function getSum (docs) {
    let sum = 0
    docs.forEach(doc => {
      sum = sum + doc.value
    })
    return sum
  }

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
      let result = await { sum: getSum(docs), items: docs }
      callback(err, result)
    }
  })
}

PaymentSchema.statics.addPayment = function (contractId, data, callback) {
  const Payment = mongoose.model('Payment')
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
}

PaymentSchema.statics.updatePayment = function (contractId, paymentId, data, callback) {
  const Payment = mongoose.model('Payment')
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
