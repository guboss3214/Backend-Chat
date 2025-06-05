const express = require('express')
const {
  createChat,
  getAllChats,
  getChatById,
  deleteChat,
  updateChat,
  findOrCreateChat,
} = require('../controllers/chatController')

const router = express.Router()

router.get('/', getAllChats)

router.get('/:id', getChatById)

router.post('/find', findOrCreateChat)

router.post('/', createChat)

router.put('/:id', updateChat)

router.delete('/:id', deleteChat)

module.exports = router
