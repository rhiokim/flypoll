const express = require('express')
const router = express.Router()

const requestIp = require('request-ip')
const { createPoll, getPoll, getVotes, getVotePer, getVoteCount, voting, isPoll, isOption } = require('../libs/firebase')

const svg = require('../pages/svg')
const p404 = require('../pages/404')
const pErr = require('../pages/error')
const pDone = require('../pages/done')

router.route('/')
  .post(async (req, res, next) => {
    const body = req.body
    res.json(await createPoll(body))
  })

router.get('/:id', async (req, res) => {
  const poll = await getPoll(req.params)
  res.json(poll)
})

router.get('/:id/result', async (req, res) => {
  const result = await getVotes(req.params.id)
  res.json(result)
})

router.get('/:id/:option', async (req, res) => {
  const { id, option } = req.params

  if (!await isOption(req.params)) {
    res.send(pErr('001', 'Option is not exist'))
    return
  }

  const { per, choose } = await getVotePer(id, option)
  const { Config } = await getPoll(req.params)
  const style = Config.style || {}

  res.setHeader('Content-Type', 'image/svg+xml')
  res.setHeader('Cache-Control', 'private')
  res.send(svg(id, option, per, choose, style.width, style.barColor))
})

router.get('/:id/:option/vote', async (req, res) => {
  if (!await isPoll(req.params.id)) {
    res.send(pErr('001', 'Poll is not exist'))
    return
  }

  const ip = requestIp.getClientIp(req)
  const { Config } = await getPoll(req.params)

  if (await getVoteCount({ id: req.params.id, ip }) < Config.maximumVotes) {
    await voting(Object.assign({}, req.params, { ip }))
    res.send(pDone(200, `Thanks for the voting`, req.headers.referer))
  } else {
    res.send(pDone(200, `You've already done`, req.headers.referer))
  }
})

module.exports = router
