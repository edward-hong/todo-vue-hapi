require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Cloudant = require('@cloudant/cloudant')

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

  const url = process.env.CLOUDANT_URL
  const username = process.env.CLOUDANT_USERNME

  const cloudant = Cloudant({ url, username })
  const db = cloudant.db.use('todo-vue-hapi')

  authRoutes(server, db)

  await server.start()
  console.log(`Server running on port ${PORT}`)
}

init()
