const { add, list, remove, edit, complete } = require('../controllers/todo')

const routes = (server, db) => {
  server.route({
    method: 'GET',
    path: '/todo/list',
    handler: list(db),
  })

  server.route({
    method: 'POST',
    path: '/todo/add',
    handler: add(db),
  })

  server.route({
    method: 'DELETE',
    path: '/todo/remove',
    handler: remove(db),
  })

  server.route({
    method: 'PUT',
    path: '/todo/edit',
    handler: edit(db),
  })

  server.route({
    method: 'PUT',
    path: '/todo/complete',
    handler: complete(db),
  })
}

module.exports = routes
