const { Schema, model } = require('mongoose');

const agreementSchema = new Schema(
  {
    startDate: { type: Date, required: true},
    endDate: { type: Date, required: true},
    agreementName: { type: String, required: true, trim: true },
    fareName: { type: String, required: true, trim: true }, 
  },
  {
    timestamps: true
  }
);

module.exports = model('Agreement', agreementSchema);