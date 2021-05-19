const Boom = require('@hapi/boom')

exports.list = db => async (request, h) => {
  const { email } = request.query

  const response = await db.partitionedList(email, { include_docs: true })

  return response.rows.map(({ doc }) => doc)
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

    await db.insert(newTodo)

    return {
      todo: newTodo,
      messaage: 'Todo added successfully',
    }
  } catch (err) {
    return Boom.badImplementation()
  }
}

exports.remove = db => async (request, h) => {
  const { email, todo } = request.payload

  try {
    const result = await db.get(`${email}:${todo}`)

    await db.destroy(`${email}:${todo}`, result._rev)

    return {
      messaage: 'Todo removed successfully',
    }
  } catch (err) {
    return Boom.badImplementation()
  }
}

exports.edit = db => async (request, h) => {
  const { email, todo, editedTodo } = request.payload

  try {
    const result = await db.get(`${email}:${todo}`)

    result._id = `${email}:${editedTodo}`
    result.todo = editedTodo

    await db.destroy(`${email}:${todo}`, result._rev)

    delete result._rev

    await db.insert(result)

    return {
      editedTodo: result,
      message: 'Todo edited successfully',
    }
  } catch (err) {
    return Boom.badImplementation()
  }
}

exports.complete = db => async (request, h) => {
  const { email, todo } = request.payload

  try {
    const result = await db.get(`${email}:${todo}`)

    result.completed = true

    await db.insert(result)

    return {
      completedTodo: result,
      message: 'Todo complted successfully',
    }
  } catch (err) {
    console.log(err)
    return Boom.badImplementation()
  }
}
