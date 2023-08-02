const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes/index');
const error = require('./middlewares/error');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

app.use(helmet());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(cookieParser());

app.use('/', routes);

app.use(errors());

app.use(error);

app.listen(PORT);
