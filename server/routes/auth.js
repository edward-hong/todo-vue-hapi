const { signup } = require('../controllers/auth')

const routes = server => {
  server.route({
    method: 'POST',
    path: '/auth/signup',
    handler: signup,
  })
}

module.exports = routes
