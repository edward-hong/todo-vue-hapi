const Hapi = require('@hapi/hapi')

const PORT = process.env.PORT || 5000

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: 'localhost',
  })

  server.route({
    method: 'GET',
    path: '/api/signup',
    handler: (request, h) => {
      return { data: 'you hit the signup endpoint' }
    },
  })

  await server.start()
  console.log(`Server running on port ${PORT}`)
}

init()
