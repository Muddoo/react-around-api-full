const Users = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const handleError = (res, status = 500, err = 'Internal Server Error') => res.status(status).send({ error: err });

const getUsers = (req, res) => {
  Users.find({})
    .then((all) => res.send(all))
    .catch(() => handleError(res));
};

const login = (req, res) => {
  const {email, password} = req.body;
  Users.findOne({email})
    .orFail(() => handleError(res, 401, 'Incorrect password or email'))
    .select('+password')
    .then(async (user) => {
        const match = await bcrypt.compare(password, user.password);
        const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' })
        return match ?
            res.send({ token }) :
            Promise.reject(new Error('Incorrect password or email'))
    })
    .catch((err) => (err.name === 'CastError' ? handleError(res, 400, err.message) : handleError(res, 401, err.message)))
};

const getUser = (req, res) => {
  Users.findById(req.user._id)
    .orFail(() => handleError(res, 404, 'Not Found'))
    .then((user) => res.send(user))
    .catch((err) => (err.name === 'CastError' ? handleError(res, 400, err.message) : handleError(res)));
};

const createUser = async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10)
  Users.create({...req.body, password: hash})
    .then((user) => res.send(user))
    .catch((err) => (err.name ? handleError(res, 400, err.message) : handleError(res)));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => handleError(res, 404, 'Not Found'))
    .then((user) => res.send(user))
    .catch((err) => (err.name === 'CastError' ? handleError(res, 400, err.message) : handleError(res)));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => handleError(res, 404, 'Not Found'))
    .then((user) => res.send(user))
    .catch((err) => (err.name === 'CastError' ? handleError(res, 400, err.message) : handleError(res)));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login
};
