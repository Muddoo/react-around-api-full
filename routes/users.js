const router = require('express').Router();
const {
  getUsers, getUser, updateUser, updateAvatar,
} = require('../controller/users');

router.get('/', getUsers);
router.get('/me', getUser);
// router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
