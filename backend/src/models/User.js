const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    userName: { type: String, required: true, trim: true },
    userRegNo: { type: String, required: true, unique: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    assignDate: { type: Date, required: true },
    vehicleReg: { type: String, required: true, trim: true } 
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);