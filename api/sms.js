const express = require('express');
require('dotenv').config();
const cors = require('cors')
const bodyParser = require('body-parser');
const router = express.Router();


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

router.use(cors({
  origin: '*'
}));
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

const client = require('twilio')(accountSid, authToken);

router.post('/', async (req, res) => {
  const { phoneNumbers, message } = req.body;

  const allMessageRequests = await phoneNumbers.map((to) => {
    return client.messages
      .create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
        body: message,
      })
      .then((msg) => {

        // return { success: true, sid: msg.sid };
        // Return a success response using the callback function
        return res.send(msg);
      })
      .catch((err) => {

        // return { success: false, error: err.message };
        return res.send(err);
      });
  });

  return allMessageRequests;
});

module.exports = router;
