const mongoose = require('mongoose');
const NotFoundError = require('../Error/NotFoundError');

const schema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /https?:\/\/(www\.)?[\w\]\[\/.~:?%#@!$&'()*+,;=-]+\..+/.test(v),
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
}, { versionKey: false });

schema.statics.ownerId = function isOwner(id) {
  return this.findOne({ _id: id })
    .then((card) => {
      if (!card) return Promise.reject(new NotFoundError('Card Not Found'));
      return card.owner;
    })
    .catch((err) => Promise.reject({ statusCode: err.statusCode || 400, message: err.message }));
};

module.exports = mongoose.model('card', schema);
