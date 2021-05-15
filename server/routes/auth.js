const { signup } = require('../controllers/auth')

const routes = (server, db) => {
  server.route({
    method: 'POST',
    path: '/auth/signup',
    handler: signup(db),
  })
}

module.exports = routes
