const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const notesRouter = require('./controllers/blogs')
//const config = require('./utils/config')

const url = "mongodb://laiskiainen:laiskiainen@ds129428.mlab.com:29428/blogilista_test"
mongoose.connect(url)
//mongoose.connect(config.mongoUrl)
mongoose.Promise = global.Promise

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use('/api/blogs', notesRouter)

const server = http.createServer(app)

const PORT = 3003
//const PORT = config.port
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}

/*app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})*/
