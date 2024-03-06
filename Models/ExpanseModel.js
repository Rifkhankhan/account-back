const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExpanseSchema = new Schema(
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

    type: {
      type: String,
      required: true
    }
  },
	{ timestamps: true }
);

const ExpanseModel = mongoose.model('Expanse', ExpanseSchema);
module.exports = ExpanseModel;
