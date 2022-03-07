const router = require('express').Router();
const {
  getUser,
  patchUser,
} = require('../controllers/users');

const { validationPatchUser } = require('../middlewares/validation');

router.get('/me', getUser);
router.patch('/me', validationPatchUser, patchUser);

module.exports = router;
