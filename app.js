require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./utils/limiter');

const routes = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(helmet()); // мидлвэр автоматически проставляет заголовки без-ти Content-Security-Policy
app.use(limiter); // мидлвэр ограничения количества запросов с одного IP

app.use(routes);

app.use(errors()); // обработчик ошибок celebrate

app.listen(PORT);
