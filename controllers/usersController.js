const User = require('../models/User')

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' })
  }
}

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId // Припускаємо, що тут вже є id користувача (наприклад, з middleware)

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: userId not found' })
    }

    const user = await User.findById(userId).select('_id name email')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({
      userId: user._id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error('Error fetching current user:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  getAllUsers,
  getCurrentUser,
}
