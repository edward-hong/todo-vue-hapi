require('dotenv').config()

const Hapi = require('@hapi/hapi')

const authRoutes = require('./routes/auth')

const PORT = process.env.PORT || 5000

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  authRoutes(server)

  await server.start()
  console.log(`Server running on port ${PORT}`)
}

init()
