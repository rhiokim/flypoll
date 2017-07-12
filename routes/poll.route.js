const express = require('express')
const router = express.Router()

const requestIp = require('request-ip')
const { createPoll, getPoll, getVotes, getVotePer, voting, isVoted, isOption } = require('../libs/db')

const svg = require('../pages/svg')
const p404 = require('../pages/404')
const pErr = require('../pages/error')
const pDone = require('../pages/done')

router.route('/')
  .post((req, res, next) => {
    const body = req.body
    const poll = createPoll(body)
    res.json({ id: poll.Id })
  })

router.get('/:id', (req, res) => {
  const poll = getPoll(req.params)
  res.json(poll)
})

router.get('/:id/result', (req, res) => {
  const result = getVotes(req.params.id)
  res.json(result)
})

router.get('/:id/:option', (req, res) => {
  const { id, option } = req.params

  if (!isOption(req.params)) {
    res.send(pErr('001', 'Option is not exist'))
    return
  }

  const { per, choose } = getVotePer(id, option)

  res.setHeader('Content-Type', 'image/svg+xml')
  res.setHeader('Cache-Control', 'private')
  res.send(svg(id, option, per, choose))
})

router.get('/:id/:option/vote', (req, res) => {
  const ip = requestIp.getClientIp(req)

  if (!isVoted({ id: req.params.id, ip })) {
    voting(Object.assign({}, req.params, { ip }))
  }

  res.send(pDone(200, `Thanks for the voting`, req.headers.referer))
})

module.exports = router
