const cards = require('../models/card');

const handleError = (res, status = 500, err = 'Internal Server Error') => res.status(status).send({ error: err });

const getCards = (req, res) => {
  cards.find({})
    .populate('likes')
    .then((all) => res.send(all))
    .catch(() => handleError(res));
};

const createCard = (req, res) => {
  cards.create({ ...req.body, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => (err.name === 'ValidationError' ? handleError(res, 400, err.message) : handleError(res)));
};

const deleteCard = async (req, res) => {
  try {
    const ownerId = await cards.ownerId(req.params.cardId);
    return String(ownerId) === req.user._id ?
        cards.findByIdAndDelete(req.params.cardId)
          .orFail(() => handleError(res, 404, 'Not Found'))
          .then(() => res.send({ message: 'Card Deleted' }))
          .catch((err) => (err.name === 'CastError' ? handleError(res, 400, err.message) : handleError(res))) :
        res.status(400).send({error: 'Not Allowed'})
  } catch (err) {
       err.name === 'Error' ? handleError(res, 404, err.message) : handleError(res, 400, err.message)
  }
};

const likeCard = (req, res) => {
  cards.findByIdAndUpdate(req.params.cardId, {
    $addToSet: { likes: req.user._id },
  }, { new: true })
    .orFail(() => handleError(res, 404, 'Not Found'))
    .populate('likes')
    .then((card) => res.send(card))
    .catch((err) => (err.name === 'CastError' ? handleError(res, 400, err.message) : handleError(res)));
};

const dislikeCard = (req, res) => {
  cards.findByIdAndUpdate(req.params.cardId, {
    $pull: { likes: req.user._id },
  }, { new: true })
    .orFail(() => handleError(res, 404, 'Not Found'))
    .then((card) => res.send(card))
    .catch((err) => (err.name === 'CastError' ? handleError(res, 400, err.message) : handleError(res)));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
