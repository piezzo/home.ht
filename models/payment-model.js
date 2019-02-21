const mongoose = require('mongoose')
mongoose.Promise = global.Promise

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

}

PaymentSchema.statics.addPayment = function (data) {
  const Payment = mongoose.model('Payment')
}

PaymentSchema.statics.updatePayment = function (data, callback) {
  const Payment = mongoose.model('Payment')
}

PaymentSchema.statics.deletePayment = function (data, callback) {
  const Payment = mongoose.model('Payment')
}

mongoose.model('Payment', PaymentSchema)
