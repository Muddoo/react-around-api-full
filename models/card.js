const mongoose = require('mongoose');

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
});

schema.statics.ownerId = function isOwner(id) {
  return this.findOne({_id: id})
             .then(card => {
               if(!card) return Promise.reject(new Error('Not Found'))
               return card.owner._id
             })
             .catch(err => Promise.reject(err))
}

module.exports = mongoose.model('card', schema);
