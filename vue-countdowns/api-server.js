import express from 'express'
import bodyParser from 'body-parser'
import PouchDB from 'pouchdb'

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
      { description: 'Far in the future', endDateTime: new Date('2017-12-31T23:59:59Z') }
    ]
  }
]

// attempt to connect to the local database, bail out if it doesn't work
const db = new PouchDB('http://localhost:5984/countdowns')

db.info()
  .then(info => {
    console.log(`Database '${info.db_name}' connected`)
    startServer()

    // insert the dummy data if the database is new (i.e. has never had any documents created)
    if (!info.update_seq) {
      console.log('Database was created - inserting test data')

      // convert the id property of the dummy data to the _id required by PouchDB
      const testData = DUMMY_USERS.map(({id, countdowns}) => ({_id: id, countdowns}))
      db.bulkDocs(testData)
        .catch((err) => console.log(`Error inserting test data: ${err}`))
    }
  })
  .catch((err) => {
    console.error(`Unable to connect to database: ${err}`)
    process.exitCode = 1
  })

function startServer() {

  const app = express()


  app.get('/users', (req, res) => {
    db.allDocs()
      .then(allDocs => allDocs.rows.map(doc => doc.id))
      .then(users => res.json({users}))
      .catch(err => {
        console.error(err)
        res.status(404).end()
      })
  })


  app.get('/countdowns/:userId', (req, res) => {
    db.get(req.params.userId)
      .catch(() => Promise.resolve({countdowns: []}))
      .then(doc => res.json(doc))
  })


  app.post('/countdowns/:userId', bodyParser.json(), (req, res) => {
    // respond with bad request status code if the body is empty or has no countdowns property
    if (!req.body || !req.body.countdowns || !Array.isArray(req.body.countdowns)) {
      res.status(400)
      res.end()
      return
    }

    const doc = {
      _id: req.params.userId,
      countdowns: req.body.countdowns
    }

    db.get(doc._id)
      .then(current => {
        doc._rev = current._rev
        return doc;
      })
      .catch(() => Promise.resolve(doc))
      .then(doc => db.put(doc))
  })

  const { PORT = 3000 } = process.env

  app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`)
  })

}
