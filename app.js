const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
const centralError = require('./middlewares/centralError');
const limiter = require('./middlewares/limiter');

const app = express();

app.use(limiter);

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/moviesdb');

app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(centralError);

app.listen(PORT);
