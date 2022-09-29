require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
const centralError = require('./middlewares/centralError');
const limiter = require('./middlewares/limiter');
const { mongodb } = require('./utils/config');

const app = express();
app.use(helmet());
app.use(requestLogger);
app.use(limiter);

const { PORT = 3000 } = process.env;

mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.DB_CONN : mongodb, {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(cors());
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(centralError);

app.listen(PORT);
