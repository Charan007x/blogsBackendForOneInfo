import Pricing from '../models/Pricing.js';

// @desc    Get pricing plans
// @route   GET /api/pricing
// @access  Public
const getPricing = async (req, res) => {
  try {
    let pricing = await Pricing.findOne();
    
    // Seed default if not exists
    if (!pricing) {
      pricing = await Pricing.create({
        plans: [
          { id: 1, price: 349, pricePerDay: 11.6 },
          { id: 2, price: 799, pricePerDay: 8.9 },
          { id: 3, price: 3499, pricePerDay: 9.6 },
        ]
      });
    }

    res.json(pricing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update pricing plans
// @route   PUT /api/admin/pricing
// @access  Admin
const updatePricing = async (req, res) => {
  try {
    const daysMap = { 1: 30, 2: 90, 3: 365 };
    
    const plansToSave = req.body.plans.map(plan => ({
      id: plan.id,
      price: plan.price,
      pricePerDay: Number((plan.price / (daysMap[plan.id] || 30)).toFixed(1))
    }));

    let pricing = await Pricing.findOne();
    
    if (pricing) {
      pricing.plans = plansToSave;
      const updatedPricing = await pricing.save();
      res.json(updatedPricing);
    } else {
      const newPricing = await Pricing.create({ plans: plansToSave });
      res.status(201).json(newPricing);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getPricing, updatePricing };
