const Message = require('../models/Message')
const axios = require('axios')
const https = require('https')

const BOT_ID = '642b4d5f1e8f9c1234567890'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find()
    res.json(messages)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' })
  }
}

const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
    if (!message) return res.status(404).json({ message: 'Message not found' })
    res.json(message)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching message' })
  }
}

const getMessagesByChatId = async (req, res) => {
  try {
    const { chatId } = req.params

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 })

    res.json(messages)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' })
  }
}

const createMessage = async (req, res) => {
  const { chat, sender, text } = req.body

  if (!chat || !sender || !text) {
    return res
      .status(400)
      .json({ message: 'chat, sender, and text are required' })
  }

  try {
    let message = await Message.create({ chat, sender, text })
    await message.populate('sender', '_id name avatar')

    res.status(201).json(message)

    setTimeout(async () => {
      try {
        const quoteRes = await axios.get('https://api.quotable.io/random', {
          httpsAgent: agent,
        })
        const quote = quoteRes.data.content

        let autoReply = await Message.create({
          chat,
          sender: BOT_ID,
          text: quote,
        })
        await autoReply.populate('sender', '_id name avatar')

        console.log('🤖 Auto-response sent:', quote)
      } catch (err) {
        console.error('❌ Failed to send auto-response:', err.message)
      }
    }, 3000)
  } catch (err) {
    console.error('❌ Error creating message:', err.message)
    res.status(500).json({ message: 'Error creating message' })
  }
}

const updateMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    if (!message) return res.status(404).json({ message: 'Message not found' })
    res.json(message)
  } catch (err) {
    res.status(500).json({ message: 'Error updating message' })
  }
}

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id)
    if (!message) return res.status(404).json({ message: 'Message not found' })
    res.json({ message: 'Message deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting message' })
  }
}

module.exports = {
  getAllMessages,
  getMessageById,
  getMessagesByChatId,
  createMessage,
  updateMessage,
  deleteMessage,
}
