const jwt = require('jsonwebtoken')

const getTokenFromHeader = (req) => {
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1]
  }
  // Support headers with no "Token/Bearer" in auth header
  if (req.headers.authorization) {
    return req.headers.authorization
  }
  return null
}

const getUser = (req) => {
  const token = getTokenFromHeader(req)
  try {
    if (!token) return null
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    console.log(err)
    return null
  }
}

module.exports = getUser
