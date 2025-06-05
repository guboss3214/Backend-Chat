require('dotenv').config()
const mongoose = require('mongoose')

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Database connected successfully')
  } catch (error) {
    console.log('Database connection failed:', error.message)
    process.exit(1)
  }
}

module.exports = connectDatabase
