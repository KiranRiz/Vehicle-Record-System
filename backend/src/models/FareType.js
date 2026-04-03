const { Schema, model } = require('mongoose');

const fareTypeSchema = new Schema(
  {
    fareName: { type: String, required: true},
    fareType: { type: String, required: true, enum : ['Fixed', 'Metered', 'Dynamic'], default: 'Fixed' }, 
    minimumFare: { type: Number, required: true, min: 0},
    maximumFare: { type: Number, required: true, min: 0},
    
  },
  {
    timestamps: true
  }
);

module.exports = model('FareType', fareTypeSchema);