const { Schema, model } = require('mongoose');

const agreementSchema = new Schema(
  {
    startDate: { type: Date, required: true},
    endDate: { type: Date, required: true},
    seatingCapacity: { type: Number, required: true, min:1},
    fareType: { type: String, required: true, enum : ['Fixed', 'Metered', 'Dynamic'], default: 'Fixed' }, 
  },
  {
    timestamps: true
  }
);

module.exports = model('Agreement', agreementSchema);