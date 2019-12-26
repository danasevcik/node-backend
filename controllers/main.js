// called from server get /getAllUsers
// select all entries from the users table
// send back all json items
const getTableData = (req, res, db) => {
  db.select('*').from('users')
    .then(items => {
      if(items.length){
        res.json(items)
      } else {
        res.json({dataExists: 'false'})
      }
    })
    .catch(err => res.status(400).json({dbError: 'db error'}))
}

// called from server post /createNewUser
// add new user based on first name, last name, email and new date created
// send back json item
const postTableData = (req, res, db) => {
  const { first, last, email } = req.body
  const added = new Date()
  db('users').insert({first, last, email, added})
    .returning('*')
    .then(item => {
      res.json(item)
    })
    .catch(err => res.status(400).json({dbError: 'db error'}))
}

// called from put /editUser
// update based on first name, last name and email
// send back updated json item
const putTableData = (req, res, db) => {
  const { id, first, last, email, phone, location, hobby } = req.body
  db('users').where({id}).update({first, last, email})
    .returning('*')
    .then(item => {
      res.json(item)
    })
    .catch(err => res.status(400).json({dbError: 'db error'}))
}

// called from delete /deleteUser
// delete based on user id
// send back json obj where delete points to true
const deleteTableData = (req, res, db) => {
  const { id } = req.body
  db('users').where({id}).del()
    .then(() => {
      res.json({delete: 'true'})
    })
    .catch(err => res.status(400).json({dbError: 'db error'}))
}

// export so the server can access fcns
module.exports = {
  getTableData,
  postTableData,
  putTableData,
  deleteTableData
}
