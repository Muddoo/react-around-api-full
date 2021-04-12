const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');
const NotFoundError = require('./Error/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

require('dotenv').config();

const app = express();
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { createUser, login } = require('./controller/users');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');

const { PORT = 3001, DATABASEURL = 'mongodb://localhost:27017/aroundb' } = process.env;

mongoose.connect(DATABASEURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(requestLogger);
app.use(limiter);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4).max(16),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4).max(16),
  }),
}), createUser);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('*', (req, res, next) => next(new NotFoundError('Requested resource not found')));

app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT, () => console.log(`Listening to port: ${PORT}`));
