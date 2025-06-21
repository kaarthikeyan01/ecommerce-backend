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
          required: true
        },
        priceAtPurchase: {
          type: Number,
          required: true
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },

    orderStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing'
    },

    deliveredAt: Date
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order