const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    isDefault: {
      type: Boolean, // if a user has three address default: true will be consideres so when user 
      default: false // craetes a new adress make isdefault:false for prev ones
    }
  },
  {
    timestamps: true
  }
);

module.Address = mongoose.model('Address', addressSchema);
export default Address