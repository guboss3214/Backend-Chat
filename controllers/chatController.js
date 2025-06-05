const mongoose = require('mongoose')
const Chat = require('../models/Chat')
const Message = require('../models/Message')

const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().populate('users', 'name email')
    res.json(chats)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chats' })
  }
}

const getChatById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid chat ID' })
  }
  try {
    const chat = await Chat.findById(req.params.id).populate(
      'users',
      'name email'
    )
    if (!chat) return res.status(404).json({ message: 'Chat not found' })
    res.json(chat)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chat' })
  }
}

const createChat = async (req, res) => {
  try {
    const { firstName, lastName } = req.body
    const currentUserId = req.user._id

    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ message: 'First and last name are required' })
    }

    const targetUser = await User.findOne({
      firstName,
      lastName,
    })

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Якщо хтось намагається створити чат з собою
    if (targetUser._id.toString() === currentUserId.toString()) {
      return res
        .status(400)
        .json({ message: 'Cannot create chat with yourself' })
    }

    const existingChat = await Chat.findOne({
      users: { $all: [currentUserId, targetUser._id] },
      $expr: { $eq: [{ $size: '$users' }, 2] },
    })

    if (existingChat) {
      return res.status(200).json(existingChat)
    }

    const newChat = await Chat.create({
      users: [currentUserId, targetUser._id],
    })

    const fullChat = await newChat.populate('users', 'firstName lastName email')
    res.status(201).json(fullChat)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const findChatByTwoUsers = async (req, res) => {
  const { userId1, userId2 } = req.body

  if (!userId1 || !userId2) {
    return res.status(400).json({ message: 'Both user IDs are required' })
  }

  if (
    !mongoose.Types.ObjectId.isValid(userId1) ||
    !mongoose.Types.ObjectId.isValid(userId2)
  ) {
    return res.status(400).json({ message: 'Invalid user ID format' })
  }

  if (userId1 === userId2) {
    return res.status(400).json({ message: 'Cannot create chat with yourself' })
  }

  try {
    const chat = await Chat.findOne({
      $and: [
        { users: { $size: 2 } },
        { users: { $all: [userId1, userId2] } },
        { isGroup: { $ne: true } },
      ],
    }).populate('users', 'name email')

    if (chat) {
      console.log(`Found existing chat: ${chat._id}`)
      res.json({
        exists: true,
        chatId: chat._id,
        chat: chat,
      })
    } else {
      console.log(`No chat found between users: ${userId1} and ${userId2}`)
      res.json({
        exists: false,
        chatId: null,
        chat: null,
      })
    }
  } catch (error) {
    console.error('Error finding chat between users:', error)
    res.status(500).json({ message: 'Error searching for chat' })
  }
}

const updateChat = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid chat ID' })
  }
  try {
    const chat = await Chat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate('users', 'name email')
    if (!chat) return res.status(404).json({ message: 'Chat not found' })
    res.json(chat)
  } catch (err) {
    res.status(500).json({ message: 'Error updating chat' })
  }
}

const deleteChat = async (req, res) => {
  const chatId = req.params.id

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ message: 'Invalid chat ID' })
  }

  try {
    const chat = await Chat.findByIdAndDelete(chatId)
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    await Message.deleteMany({ chat: chatId })

    res.json({ message: 'Chat and its messages deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error deleting chat and messages' })
  }
}

const findOrCreateChat = async (req, res) => {
  const { userId1, userId2 } = req.body
  if (!userId1 || !userId2) {
    return res.status(400).json({ message: 'Both user IDs are required' })
  }

  try {
    let chat = await Chat.findOne({
      isGroup: false,
      users: { $all: [userId1, userId2] },
    }).populate('users', '-password')

    if (!chat) {
      chat = new Chat({
        users: [userId1, userId2],
        isGroup: false,
      })
      await chat.save()
      chat = await Chat.findById(chat._id).populate('users', '-password')
    }

    res.status(200).json(chat)
  } catch (error) {
    console.error('Error finding or creating chat:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getAllChats,
  getChatById,
  createChat,
  updateChat,
  deleteChat,
  findOrCreateChat,
  findChatByTwoUsers,
}
