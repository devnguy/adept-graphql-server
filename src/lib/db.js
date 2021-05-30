const { PrismaClient } = require('@prisma/client')

let prisma = PrismaClient

// This is supposed to improve performance for next.js
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

module.exports = {
  prisma,
}
