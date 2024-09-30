const { default: mongoose } = require("mongoose");
const { type } = require("os");

const PaymentSchema = new mongoose.Schema({

    user_id: {
        type: String
    },
    attendant_id: {
        type: String
    },
    amount: {
        type: BigInt
    },
    method: {
        type: String           // need to check once
    },
    date: {
        type: Date
    },
    status: {
        type: Boolean
    }

});

module.exports = mongoose.model('Payment',PaymentSchema)