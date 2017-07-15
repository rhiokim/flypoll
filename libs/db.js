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

const merge = (data) => {
  console.log('merge1', data)
  const polls = db.get('polls')

  data.polls.forEach(poll => {
    polls.push(poll).write()

    console.log('merge2', poll)
  })

  delete data['polls']

  for (let uid in data) {
    console.log('merge3', uid, data[uid])
    db.set(uid, data[uid]).write()
  }
}

const voting = ({ id, option, ip }) => {
  console.log('voting', option)
  db.get(id)
    .push({ text: decodeURIComponent(option), ip, votedAt: new Date() })
    .write()
}

const isPoll = (id) => db.get('polls').find({ Id: id }).value()

const isVoted = ({ id, ip }) => {
  return db.get(id).find({ip}).value()
}

const getVoteCount = ({ id, ip }) => {
  return db.get(id).filter({ip}).size().value()
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
  getVoteCount,
  isOption,
  voting,
  merge
}
