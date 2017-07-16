const firebase = require('firebase')
const config = require('../.firebase.json')

firebase.initializeApp(config)
const database = firebase.database()

const createPoll = async ({ options, config }) => {
  options = options.map((option, i) => Object({ id: i, text: option }))
  const poll = {
    Options: options, Config: config, CreatedAt: new Date()
  }

  const ref = database.ref('polls').push()
  await ref.set(poll)

  await database.ref(`votes/${ref.key}`).set([])

  return { id: ref.key }
}

const getItem = async (key, id) => {
  const snapshot = await database
    .ref(`${key}/${id}`)
    .once('value')

  return snapshot.val()
}

const getPoll = async ({ id }) => {
  const snapshot = await getItem('polls', id)

  return snapshot || {}
}

const getVotes = async id => {
  const snapshot = await getItem('votes', id)

  return snapshot || {}
}

const getVote = async (id, text) => {
  const votes = await getVotes(id)
  const keys = Object.keys(votes).filter(key => votes[key].text === decodeURIComponent(text))

  return keys.length
}

const getVotePer = async (id, text) => {
  const votes = await getVotes(id)
  const choose = await getVote(id, decodeURIComponent(text))

  return {
    per: parseInt(choose / Object.keys(votes).length * 100, 10) | 0,
    choose
  }
}

const merge = async data => {
  const { polls, votes } = data
  Object.keys(polls).forEach(key => {
    database.ref(`polls/${key}`).set(
      polls[key]
    )
  })

  Object.keys(votes).forEach(key => {
    console.log('votes:', key)
  })
}

const voting = async ({ id, option, ip }) => {
  console.log(id, option, ip)
  await database
    .ref(`votes/${id}`)
    .push()
    .set({ text: decodeURIComponent(option), ip, votedAt: new Date() })
}

// const isPoll = (id) => db.get('polls').find({ Id: id }).value()
const isPoll = async id => {
  const poll = await database.ref(`polls/${id}`).once('value')
  return poll.val()
}

const getVoteCount = async ({ id, ip }) => {
  const votes = await getVotes(id)
  return Object.keys(votes).filter(key => votes[key].ip === ip).length
}

const isOption = async ({ id, option }) => {
  const poll = await isPoll(id)

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
  getVoteCount,
  isPoll,
  isOption,
  voting,
  merge
}
