const Users = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const handleError = (res, status = 500, err = 'Internal Server Error') => res.status(status).send({ error: err });
const handleError = (res, err, status = 404) => {
  if(err.name === 'Error') return res.status(status).send({error: err.message})
  if(err.name === 'CastError' || err.name === 'ValidationError') return res.status(400).send({error: err.message})
  return res.status(500).send('Internal Server Error')
};

const getUsers = (req, res) => {
  Users.find({})
    .then((all) => res.send(all))
    .catch((err) => handleError(res,err));
};

const login = (req, res) => {
  const {email, password} = req.body;
  Users.findOne({email})
    .orFail(() => new Error('Incorrect password or email'))
    .select('+password')
    .then(async (user) => {
        const match = await bcrypt.compare(password, user.password);
        const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' })
        return match ?
            res.send({ token }) :
            Promise.reject(new Error('Incorrect password or email'))
    })
    .catch((err) => handleError(res,err, 401))
};

const getUser = (req, res) => {
  Users.findById(req.user._id)
    .orFail(() => new Error('Not Found'))
    .then((user) => {
      const {_doc: {password, ...props}} = user;
      res.send({data: props})
    })
    .catch((err) => handleError(res,err));
};

const createUser = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10)
    Users.create({...req.body, password: hash})
      .then((user) => {
        const {_doc: {password, ...props}} = user;
        res.send({data: props})
      })
      .catch((err) => handleError(res,err));
  } catch (err) {
      handleError(res, 400, err.message)
  }
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new Error('Not Found'))
    .then((user) => res.send(user))
    .catch((err) => (err.name === 'CastError' ? handleError(res, 400, err.message) : handleError(res)));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new Error('Not Found'))
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
