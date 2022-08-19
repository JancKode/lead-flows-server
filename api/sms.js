const express = require('express');
const router = express.Router();
require('dotenv').config();
const cors = require('cors');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const bodyParser = require('body-parser');
const client = require('twilio')(accountSid, authToken);

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

router.post('/', async (req, res) => {
  const { phoneNumbers, message, isScheduled } = req.body;
  const recipients = phoneNumbers.split(',').map((x) => x.trim())
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (!isScheduled) {

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
          return res.sendStatus(200).send(msg);
          // return res.status(200).send(msg);
        })
        .catch((err) => {
          console.log(err)
          // return { success: false, error: err.message };
          return res.sendStatus(400).send(err)
          // return res.status(400).send(err);
        });
    });

    return allMessageRequests;
  } else {
    const scheduledMessageRequest = await phoneNumbers.map((to) => {
      return client.messages
        .create({
          messagingServiceSid: process.env.TWILIO_MESSAGING_SID,
          sendAt: new Date((isScheduled)),
          scheduleType: 'fixed',
          from: process.env.TWILIO_PHONE_NUMBER,
          to,
          body: message
        })
        .then((msg) => {

          // return { success: true, sid: msg.sid };
          // Return a success response using the callback function
          return res.sendStatus(200).send(msg);
          // return res.status(200).send(msg);
        })
        .catch((err) => {
          console.log(err.message)
          // return { success: false, error: err.message };
          return res.sendStatus(400).send(err.message)
          // return res.status(400).send(err);
        });
    });

    return scheduledMessageRequest;
  }
});

router.use(cors())

module.exports = router;
