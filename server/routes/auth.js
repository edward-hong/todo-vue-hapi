const { signup, activate } = require('../controllers/auth')
const {
  userSignupValidator,
  userActivationValidator,
} = require('../validators/auth')

const routes = (server, db) => {
  server.route({
    method: 'POST',
    path: '/auth/signup',
    handler: signup(db),
    options: {
      validate: userSignupValidator,
    },
  })

  server.route({
    method: 'POST',
    path: '/auth/activate',
    handler: activate(db),
    options: {
      validate: userActivationValidator,
    },
  })
}

module.exports = routes
