import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  pricePerDay: {
    type: Number,
    required: true,
  }
});

const pricingSchema = new mongoose.Schema({
  plans: [planSchema],
}, {
  timestamps: true,
});

const Pricing = mongoose.model('Pricing', pricingSchema);

export default Pricing;
