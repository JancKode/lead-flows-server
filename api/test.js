const app = require('express')();
const { v4 } = require('uuid');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const bodyParser = require('body-parser');
const client = require('twilio')(accountSid, authToken);


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/api/sms', (req, res) => {
  const { phoneNumbers, message, isScheduled } = req.body;
  console.log('phoneNumbers', phoneNumbers)
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);



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
          res.sendStatus(200)
          return res.status(200).send(msg);
        })
        .catch((err) => {

          // return { success: false, error: err.message };
          res.sendStatus(400)
          return res.status(400).send(err);
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
          res.sendStatus(200)
          return res.status(200).send(msg);
        })
        .catch((err) => {

          // return { success: false, error: err.message };
          res.sendStatus(400)
          return res.status(400).send(err);
        });
    });

    return scheduledMessageRequest;
  }


});


module.exports = app;