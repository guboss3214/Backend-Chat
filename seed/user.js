require('dotenv').config()

const mongoose = require('mongoose')
const User = require('../models/User')

const MONGO_URI = process.env.DB_URL || ''

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('Connected to MongoDB')

    // Створюємо користувача
    const user = new User({
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://example.com/avatar.jpg',
    })

    await user.save()
    console.log('User created successfully')

    await mongoose.disconnect()
  } catch (error) {
    console.error('Error seeding user:', error)
    process.exit(1)
  }
}

seed()
