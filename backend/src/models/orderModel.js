const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        priceAtPurchase: {
          type: Number,
          required: true
        }
      }
    ],

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },

    orderStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing'
    },

    totalAmount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'paypal', 'cod'],
      required: true
    },

    paidAt: Date,
    deliveredAt: Date
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order