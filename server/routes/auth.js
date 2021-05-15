const { signup } = require('../controllers/auth')
const { userSignupValidator } = require('../validators/auth')

const routes = (server, db) => {
  server.route({
    method: 'POST',
    path: '/auth/signup',
    handler: signup(db),
    options: {
      validate: userSignupValidator,
    },
  })
}

module.exports = routes
