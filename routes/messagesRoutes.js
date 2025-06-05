const express = require('express')

const {
  getAllMessages,
  getMessageById,
  getMessagesByChatId,
  createMessage,
  updateMessage,
  deleteMessage,
} = require('../controllers/messagesController')

const router = express.Router()

router.get('/', getAllMessages)
router.get('/:id', getMessageById)
router.get('/chat/:chatId', getMessagesByChatId)
router.post('/', createMessage)
router.put('/:id', updateMessage)
router.delete('/:id', deleteMessage)

module.exports = router
