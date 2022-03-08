require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');
const limiter = require('./utils/limiter');
const { errorLogger, requestLogger } = require('./middlewares/logger');

const routes = require('./routes');

const { NODE_ENV, PORT = 3000, DB_URL } = process.env;

const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB_URL : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(helmet()); // мидлвэр автоматически проставляет заголовки без-ти Content-Security-Policy
app.use(requestLogger);
app.use(errorLogger);
app.use(limiter); // мидлвэр ограничения количества запросов с одного IP

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);

app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler);

app.listen(PORT);
