const express = require('express')
const connectDatabase = require('./config/DB')
const chatRoutes = require('./routes/chatRoutes')
const usersRoutes = require('./routes/usersRoutes')
const messagesRoutes = require('./routes/messagesRoutes')
const userRoutes = require('./routes/userRoutes')
const cors = require('cors')
const dotenv = require('dotenv')

const app = express()
const PORT = process.env.PORT || 3000

connectDatabase()

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
)
app.use(express.json())

app.use('/api/chats', chatRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/auth', userRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
