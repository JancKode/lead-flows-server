const express = require('express');
const smsService = require('./api/sms');

const app = express();

const PORT = process.env.PORT || 9000;

app.use("/api/sms", smsService);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

