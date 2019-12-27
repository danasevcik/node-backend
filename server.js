const express = require('express')

// use process.env variables to keep private variables,
require('dotenv').config()

// Express Middleware
const helmet = require('helmet') // creates headers that protect from attacks (security)
const bodyParser = require('body-parser') // turns response into usable format
const cors = require('cors')  // allows/disallows cross-site communication
const morgan = require('morgan') // logs requests

// db Connection w/ Heroku
// const db = require('knex')({
//   client: 'pg',
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: true,
//   }
// });

// db Connection w/ localhost
var db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'crud-practice-1'
  }
});

// Controllers - aka, the db queries
// import fcns from main.js
const main = require('./controllers/main')

// App
// var for express
const app = express()

// App Middleware
// run backend on 3000, frontend on 3001
const whitelist = ['http://localhost:3001']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(helmet())
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(morgan('combined')) // use 'tiny' or 'combined'

// App Routes - Auth
app.get('/', (req, res) => res.send('hello world'))
// called from getItems in UserInfo component in frontend
app.get('/getAllUsers', (req, res) => main.getTableData(req, res, db))
// called from frontend addEditForm component
// send response and add new user to state of all users
app.post('/createNewUser', (req, res) => main.postTableData(req, res, db))
// called from frontend addEditForm component
// send response and update state of all users
app.put('/editUser', (req, res) => main.putTableData(req, res, db))
// called from frontend dataTable component
// send response to userInfo component - filter items
app.delete('/deleteUser', (req, res) => main.deleteTableData(req, res, db))

// App Server Connection
app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT || 3000}`)
})
