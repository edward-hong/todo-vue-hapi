const Boom = require('@hapi/boom')

exports.list = db => async (request, h) => {
  const { email } = request.query

  const response = await db.postAllDocs({
    db: 'todo-vue-hapi',
    includeDocs: true,
    startKey: email,
  })

  return response.result.rows
    .map(({ doc }) => doc)
    .filter(({ _id }) => _id.split(':')[0] !== 'auth')
}

exports.add = db => async (request, h) => {
  const { email, todo } = request.payload

  try {
    const newTodo = {
      _id: `${email}:${todo}`,
      todo,
      email,
      completed: false,
    }

    const resp = await db.postDocument({
      db: 'todo-vue-hapi',
      document: newTodo,
    })

    newTodo._rev = resp.result.rev

    return {
      todo: newTodo,
      message: 'Todo added successfully',
    }
  } catch (err) {
    return Boom.badImplementation()
  }
}

exports.remove = db => async (request, h) => {
  const { email, todo } = request.payload

  try {
    const response = await db.getDocument({
      db: 'todo-vue-hapi',
      docId: `${email}:${todo}`,
    })

    await db.deleteDocument({
      db: 'todo-vue-hapi',
      docId: `${email}:${todo}`,
      rev: response.result._rev,
    })

    return {
      message: 'Todo removed successfully',
    }
  } catch (err) {
    return Boom.badImplementation()
  }
}

exports.edit = db => async (request, h) => {
  const { email, todo, editedTodo } = request.payload

  try {
    const response = await db.getDocument({
      db: 'todo-vue-hapi',
      docId: `${email}:${todo}`,
    })

    response.result._id = `${email}:${editedTodo}`
    response.result.todo = editedTodo

    await db.deleteDocument({
      db: 'todo-vue-hapi',
      docId: `${email}:${todo}`,
      rev: response.result._rev,
    })

    delete response.result._rev

    await db.postDocument({
      db: 'todo-vue-hapi',
      document: response.result,
    })

    return {
      editedTodo: response.result,
      message: 'Todo edited successfully',
    }
  } catch (err) {
    return Boom.badImplementation()
  }
}

exports.complete = db => async (request, h) => {
  const { email, todo } = request.payload

  try {
    const response = await db.getDocument({
      db: 'todo-vue-hapi',
      docId: `${email}:${todo}`,
    })

    response.result.completed = true

    await db.postDocument({
      db: 'todo-vue-hapi',
      document: response.result,
    })

    return {
      completedTodo: response.result,
      message: 'Todo completed successfully',
    }
  } catch (err) {
    console.log(err)
    return Boom.badImplementation()
  }
}
