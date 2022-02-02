require('dotenv').config()

const path = require('path')
const Hapi = require('@hapi/hapi')
const inert = require('@hapi/inert')
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
      files: {
        relativeTo: path.join(__dirname, '..', 'client', 'dist'),
      },
    },
  })

  await server.register(inert)

  server.route({
    method: 'GET',
    path: '/{any*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        lookupCompressed: true,
      },
    },
  })

  server.ext('onPreResponse', (request, h) => {
    const response = request.response

    if (!response.isBoom) {
      return h.continue
    }

    if (response.output.statusCode === 404) {
      return h.file('index.html')
    }
  })

  authRoutes(server, db)
  todoRoutes(server, db)

  await server.start()
  console.log(`Server running on port ${PORT}`)
}

init()
