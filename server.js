const express = require('express')
const server = express()

const welcomeRouter = require('./routers/welcomeRouter')
const postsRouter = require('./routers/postsRouter')

server.use(express.json())
server.use(welcomeRouter)
server.use('/api', postsRouter)

module.exports = server