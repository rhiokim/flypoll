const low = require('lowdb')
const uuid = require('uuid-base62')

const db = low('db.json')
db.defaults({ polls: [] }).write()

const createPoll = ({ options, config }) => {
  options = options.map((option, i) => Object({ id: i, text: option }))
  const uid = uuid.v4()
  const poll = {
    Id: uid, Options: options, Config: config, CreatedAt: new Date()
  }
  db.get('polls').push(poll).write()
  // db.get('voted').push({ Id: uid }).write()
  db.set(uid, []).write()

  return poll
}

const getPoll = ({ id }) => {
  return db.get('polls')
    .find({ Id: id })
    .value()
}

const getVotes = (id) => {
  return db.get(id)
    .value()
}

const getVote = (id, text) => {
  return getVotes(id).filter(vote => vote.text === decodeURIComponent(text))
}

const getVotePer = (id, text) => {
  const votes = getVotes(id).length
  const choose = getVote(id, decodeURIComponent(text)).length

  return {
    per: parseInt(choose / votes * 100, 10) | 0,
    choose
  }
}

const voting = ({ id, option, ip }) => {
  db.get(id)
    .push({ text: decodeURIComponent(option), ip, votedAt: new Date() })
    .write()
}

const isPoll = (id) => db.get('polls').find({ Id: id }).value()

const isVoted = ({ id, ip }) => {
  return db.get(id).find({ip}).value()
}

const isOption = ({ id, option }) => {
  const poll = isPoll(id)

  if (poll) {
    return poll.Options.find(item => item.text === option)
  }
  return false
}

module.exports = {
  createPoll,
  getPoll,
  getVotes,
  getVote,
  getVotePer,
  isVoted,
  isOption,
  voting
}
