const express = require('express');
const smsService = require('./api/sms');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*'
}));

const PORT = process.env.PORT || 9000;

app.use("/api/sms", smsService);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));