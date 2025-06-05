const express = require('express')

const {
  getAllUsers,
  getCurrentUser,
} = require('../controllers/usersController')
const authMiddleware = require('../middlewares/auth')

const router = express.Router()

router.get('/', getAllUsers)
router.get('/current', authMiddleware, getCurrentUser)

module.exports = router
