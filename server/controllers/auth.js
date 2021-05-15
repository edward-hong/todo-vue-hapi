const Boom = require('@hapi/boom')

exports.signup = db => async (request, h) => {
  const { name, email, password } = request.payload

  try {
    const userList = await db.list()

    const foundUser = userList.rows.find(user => user.id === `auth:${email}`)

    if (foundUser) {
      return Boom.badRequest('Email is taken')
    }

    const newUser = { _id: `auth:${email}`, name, password, email }

    await db.insert(newUser)

    return { message: 'Signup success! Please signin' }
  } catch (err) {
    console.log(err)
  }
}
