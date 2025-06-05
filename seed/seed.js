require('dotenv').config()

const mongoose = require('mongoose')
const User = require('../models/User')
const Chat = require('../models/Chat')
const Message = require('../models/Message')

const MONGO_URI = process.env.DB_URL || ''

mongoose.connect(MONGO_URI).then(async () => {
  console.log('📦 Mongo connected')

  // Очистити всі колекції
  await User.deleteMany()
  await Chat.deleteMany()
  await Message.deleteMany()

  // Створити користувачів
  const users = await User.insertMany([
    { name: 'Alice Johnson', email: 'alice@example.com' },
    { name: 'Bob Smith', email: 'bob@example.com' },
    { name: 'Charlie Lee', email: 'charlie@example.com' },
  ])

  // Створити чати
  const chats = await Chat.insertMany([
    { users: [users[0]._id, users[1]._id], isGroup: false },
    { users: [users[1]._id, users[2]._id], isGroup: false },
    { users: [users[0]._id, users[2]._id], isGroup: false },
  ])

  // Створити повідомлення для кожного чату
  await Message.insertMany([
    {
      chat: chats[0]._id,
      sender: users[0]._id,
      text: 'Hey Bob!',
    },
    {
      chat: chats[0]._id,
      sender: users[1]._id,
      text: 'Hi Alice, how are you?',
    },
    {
      chat: chats[1]._id,
      sender: users[1]._id,
      text: 'Hello Charlie!',
    },
    {
      chat: chats[1]._id,
      sender: users[2]._id,
      text: 'Hey Bob!',
    },
    {
      chat: chats[2]._id,
      sender: users[0]._id,
      text: 'Hi Charlie!',
    },
    {
      chat: chats[2]._id,
      sender: users[2]._id,
      text: 'Yo Alice!',
    },
  ])

  console.log('✅ Seeded users, chats, and messages')
  process.exit()
})
