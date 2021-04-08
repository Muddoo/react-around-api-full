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
    .select('+password')
    .then(async (user) => {
        if(!user) return Promise.reject(new Error('Incorrect password or email'));
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
    .then((user) => {
      if(!user) return handleError(res, 404, 'Not Found');
      const {_doc: {password, ...props}} = user;
      res.send({data: props})
    })
    .catch((err) => (err.name === 'CastError' ? handleError(res, 400, err.message) : handleError(res)));
};

const createUser = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10)
    Users.create({...req.body, password: hash})
      .then((user) => {
        const {_doc: {password, ...props}} = user;
        res.send({data: props})
      })
      .catch((err) => (err.name ? handleError(res, 400, err.message) : handleError(res)));
  } catch (err) {
      handleError(res, 400, err.message)
  }
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if(!user) return handleError(res, 404, 'Not Found');
      res.send(user)
    })
    .catch((err) => (err.name === 'CastError' ? handleError(res, 400, err.message) : handleError(res)));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if(!user) return handleError(res, 404, 'Not Found');
      res.send(user)
    })
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
