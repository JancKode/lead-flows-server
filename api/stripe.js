const express = require('express');
const router = express.Router();
require('dotenv').config();
const cors = require('cors');
const envKey = process.env.NODE_ENV === 'production' ? process.env.STRIPE_SECRET_LIVE_KEY : process.env.STRIPE_SECRET_TEST_KEY;
const stripe = require('stripe')(envKey);
const bodyParser = require('body-parser');

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

router.post('/', async (req, res) => {
  console.log('envKey', envKey);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  const { amount, env, paymentMethodType, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency || 'usd',
      payment_method_types: [paymentMethodType] || ['card'],
    });

    res.sendStatus(200).json({ clientSecret: paymentIntent.client_secret });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });

  } catch (err) {
    res.sendStatus(200).json({ error: err.message });
    res.status(400).json({ error: err.message });
    return err;
  }
})

router.use(cors())

module.exports = router;