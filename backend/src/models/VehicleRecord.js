const { Schema, model } = require('mongoose');

const vehicleRecordSchema = new Schema(
  {
    vehicle: { type: String, trim: true, default: '' },
    reg: { type: String, trim: true, required: true, unique: true },
    owner: { type: String, trim: true, default: '' },
    mobile: { type: String, trim: true, default: '' },
    mileage: { type: Number, default: 0 },
    parts: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    addInfo: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

module.exports = model('VehicleRecord', vehicleRecordSchema);
