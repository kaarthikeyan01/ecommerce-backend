const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'paypal', 'cod'],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },

    transactionId: {
      type: String, // e.g., Stripe ID, Razorpay ID, etc.
      required: false
    },

    paidAt: Date,
    refundAt: Date,

    gatewayResponse: {
      type: Object // Optional: store full payment gateway response
    }
  },
  {
    timestamps: true
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment