const routes = server => {
  server.route({
    method: 'POST',
    path: '/auth/signup',
    handler: (request, h) => {
      return { data: 'you hit the signup endpoint' }
    },
  })
}

module.exports = routes
