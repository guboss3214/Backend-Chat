const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema(
  {
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ],
    isGroup: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Chat', chatSchema)
