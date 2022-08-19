const express = require('express');
const smsService = require('./api/sms');
const stripeService = require('./api/stripe');
const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 9000;


app.use("/api/sms", async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
}, smsService);
app.use("/api/create-payment-intent", stripeService);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));