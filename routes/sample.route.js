const express = require('express')
const router = express.Router()

router.route('/')
  .get((req, res, next) => {
    res.send('success')
  })

router.get('/:id', (req, res) => {
  res.json(req.params)
})

module.exports = router
