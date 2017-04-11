const http = require('http')
const express = require('express')
const path = require('path')
const displayRoutes = require('express-routemap')

const app = express()
const PORT = process.env.PORT || 8082

const routeSample = require('./routes/sample.route')

app.use('/sample', routeSample)

app.get('/', (req, res) => {
  res.send('Hi World, I\'m seed-api-server')
})

http.createServer(app).listen(PORT, () => {
  displayRoutes(app)
})
