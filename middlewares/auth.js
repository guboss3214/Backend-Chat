const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const secretKey = process.env.JWT_SECRET || 'your_jwt_secret_key' // вкажи свій секрет або візьми з env
    const decoded = jwt.verify(token, secretKey)
    req.userId = decoded.id // Припускаємо, що в токені є поле id
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = authMiddleware
