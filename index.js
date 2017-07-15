const http = require('http')
const express = require('express')
const path = require('path')
const displayRoutes = require('express-routemap')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 8082

const pkg = require('./package.json')

// const routeSample = require('./routes/sample.route')
const routePoll = require('./routes/poll.route')
const routeBase = require('./routes/base.route')

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// app.use('/sample', routeSample)
app.use('/poll', routePoll)
app.use('/_utils', routeBase)

app.get('/', (req, res) => {
  res.send('Hi World, I\'m flypoll')
})

app.get('/_version', (req, res) => res.send(`${pkg.name} - ${pkg.version}`))

http.createServer(app).listen(PORT, () => {
  displayRoutes(app)
})
