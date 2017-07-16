const express = require('express')
const router = express.Router()
const { merge } = require('../libs/firebase')

// router.get('/export', (req, res) => {
//   res.download('db.json')
// })

router.post('/import', (req, res) => {
  merge(req.body)
  res.send('done')
})

module.exports = router
