const express = require('express')

const {
  LoginUser,
  getCurrentUser,
  createUser,
} = require('../controllers/userController')

const router = express.Router()

router.post('/', LoginUser)
router.get('/me', getCurrentUser)
router.post('/register', createUser)

module.exports = router
