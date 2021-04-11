const mongoose = require('mongoose');
const validator = require('validator');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
    default: 'Explorer',
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /https?:\/\/(www\.)?[\w\]\[\/.~:?%#@!$&'()*+,;=-]+\..+/.test(v),
      message: (props) => `${props.value} is not a valid URL!`,
    },
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', schema);
