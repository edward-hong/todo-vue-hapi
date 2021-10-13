require('dotenv').config()

const Hapi = require('@hapi/hapi')
const { CloudantV1 } = require('@ibm-cloud/cloudant')
const { IamAuthenticator } = require('ibm-cloud-sdk-core')

const authenticator = new IamAuthenticator({
  apikey: process.env.CLOUDANT_IAM_API_KEY,
})

const db = new CloudantV1({
  authenticator,
})

db.setServiceUrl(process.env.CLOUDANT_URL)

const authRoutes = require('./routes/auth')
const todoRoutes = require('./routes/todo')

const PORT = process.env.PORT || 5000

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  server.route({
    method: 'GET',
    path: '/',
    handler: () => ({
      test: 'working',
    }),
  })

  authRoutes(server, db)
  todoRoutes(server, db)

  await server.start()
  console.log(`Server running on port ${PORT}`)
}

init()
