const {
  signup,
  signin,
  activate,
  forgot,
  reset,
} = require('../controllers/auth')
const {
  userSignupValidator,
  userSigninValidator,
  userActivationValidator,
  userForgotValidator,
  userResetValidator,
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
    path: '/auth/signin',
    handler: signin(db),
    options: {
      validate: userSigninValidator,
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

  server.route({
    method: 'PUT',
    path: '/auth/forgot',
    handler: forgot(db),
    options: {
      validate: userForgotValidator,
    },
  })

  server.route({
    method: 'PUT',
    path: '/auth/reset',
    handler: reset(db),
    options: {
      validate: userResetValidator,
    },
  })
}

module.exports = routes
