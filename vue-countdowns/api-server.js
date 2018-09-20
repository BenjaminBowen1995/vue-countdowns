import express from 'express'
import bodyParser from 'body-parser'

const app = express()

const DUMMY_USERS = [
  { id: 'countdown-user@bjss.com',
    countdowns: [
      { description: 'Test 1 hour countdown', endDateTime: new Date(Date.now() + 60 * 60 * 1000) },  // 1 hour ahead
      { description: 'Test 2 hour countdown', endDateTime: new Date(Date.now() + 2 * 60 * 60 * 1000) }
    ]
  },
  { id: 'someone-else@bjss.com',
    countdowns: [
      { description: 'Already expired', endDateTime: new Date },
      { description: 'Far in the future', endDateTime: new Date('2019-12-31T23:59:59Z') }
    ]
  }
]

app.get('/users', (req, res) => {
  const users = DUMMY_USERS.map(user => user.id)
  res.json({users})
})

app.get('/countdowns/:userId', (req, res) => {
  const user = DUMMY_USERS.find(user => user.id === req.params.userId)
  res.json({countdowns: user ? user.countdowns : []})
})

const { PORT = 3000 } = process.env

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`)
})

app.post('/countdowns/:userId', bodyParser.json(), (req, res) => {
  // respond with bad request status code if the body is empty or has no countdowns property
  if (!req.body || !req.body.countdowns || !Array.isArray(req.body.countdowns)) {
    res.status(400)
    res.end()
    return
  }

  const user = DUMMY_USERS.find(user => user.id === req.params.userId)
  const countdowns = (req.body.countdowns || []).map(countdown => {
    return { description: countdown.description, endDateTime: new Date(countdown.endDateTime) }
  })
  if (user) {
    user.countdowns = countdowns
  } else {
    DUMMY_USERS.push({id: req.params.userId, countdowns})
    res.status(201)
  }
  res.json({countdowns})
})
