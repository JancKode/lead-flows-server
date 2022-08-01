const express = require('express');
const router = express.Router();
require('dotenv').config();
const envKey = process.env.NODE_ENV === 'production' ? process.env.STRIPE_SECRET_LIVE_KEY : process.env.STRIPE_SECRET_TEST_KEY;
const stripe = require('stripe')(envKey);
const bodyParser = require('body-parser');

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

router.post('/', async (req, res) => {
  console.log('envKey', envKey);
  const { amount, env, paymentMethodType, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency || 'usd',
      payment_method_types: [paymentMethodType] || ['card'],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });

  } catch (err) {
    console.log('Error on stripe', err)
    res.status(400).json({ error: err.message });
    return err;
  }
})

module.exports = router;