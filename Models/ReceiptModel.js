const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReceiptSchema = new Schema(
  {
    date: {
      type: Date,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    narration: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const ReceiptModel = mongoose.model('Receipt', ReceiptSchema);
module.exports = ReceiptModel;
