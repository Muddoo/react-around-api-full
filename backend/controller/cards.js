const Cards = require('../models/card');
const NotFoundError = require('../Error/NotFoundError');
const UnauthorizedError = require('../Error/UnauthorizedError');

const getCards = (req, res, next) => {
  Cards.find({})
    .populate('likes')
    .then((all) => res.send(all))
    .catch(next);
};

const createCard = (req, res, next) => {
  Cards.create({ ...req.body, owner: req.user._id })
    .then((card) => res.send(card))
    .catch(next);
};

const deleteCard = async (req, res, next) => {
  try {
    const ownerId = await Cards.ownerId(req.params.cardId);
    return String(ownerId) === req.user._id
      ? Cards.findByIdAndDelete(req.params.cardId)
        .then(() => res.send({ message: 'Card Deleted' }))
      : next({statusCode: 403, message: 'User Not Allowed'});
  } catch (err) {
    return next(err);
  }
};

const likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params.cardId, {
    $addToSet: { likes: req.user._id },
  }, { new: true })
    .orFail(() => new NotFoundError())
    .populate('likes')
    .then((card) => res.send(card))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params.cardId, {
    $pull: { likes: req.user._id },
  }, { new: true })
    .orFail(() => new NotFoundError())
    .then((card) => res.send(card))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
