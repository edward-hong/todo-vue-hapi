const Boom = require('@hapi/boom')
const sgMail = require('@sendgrid/mail')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

sgMail.setApiKey(process.env.SENDGRID_KEY)

exports.signup = db => async (request, h) => {
  const { name, email, password } = request.payload

  try {
    const userList = await db.postAllDocs({
      db: 'todo-vue-hapi',
      includeDocs: true,
      startKey: 'auth',
    })

    const foundUser = userList.result.rows.find(
      user => user.id === `auth:${email}`
    )

    if (foundUser) {
      return Boom.badRequest('Email is taken')
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: '10m' }
    )

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Account activation link',
      html: `
        <h1>Please use the following link to activate your account</h1>
        <p>${process.env.CLIENT_URL}/activate/${token}/</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>${process.env.CLIENT_URL}</p>
      `,
    }

    await sgMail.send(emailData)

    return {
      message: `Email has been sent to ${email}. Follow the instructions to activate your account.`,
    }
  } catch (err) {
    console.error(err)
    return Boom.badImplementation()
  }
}

exports.signin = db => async (request, h) => {
  const { email, password } = request.payload

  try {
    const userList = await db.postAllDocs({
      db: 'todo-vue-hapi',
      includeDocs: true,
      startKey: 'auth',
    })

    const foundUser = userList.result.rows.find(
      user => user.id === `auth:${email}`
    )

    if (!foundUser) {
      return Boom.badRequest(
        'User with that email does not exist. Please signup'
      )
    }

    const user = await db.getDocument({
      db: 'todo-vue-hapi',
      docId: `auth:${email}`,
    })

    const hashedPassword = crypto
      .createHmac('sha1', user.result.salt)
      .update(password)
      .digest('hex')

    if (hashedPassword !== user.result.hashedPassword) {
      return Boom.badRequest('Email and password do not match')
    } else {
      const token = jwt.sign(
        { email: user.result.email },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d',
        }
      )
      return {
        token,
        user: { name: user.result.name, email: user.result.email },
      }
    }
  } catch (err) {
    return Boom.badImplementation()
  }
}

exports.activate = db => async (request, h) => {
  const { token } = request.payload

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION)

      const { name, email, password } = jwt.decode(token)

      const salt = Math.round(new Date().valueOf() * Math.random()) + ''

      const hashedPassword = crypto
        .createHmac('sha1', salt)
        .update(password)
        .digest('hex')

      const newUser = {
        _id: `auth:${email}`,
        name,
        email,
        salt,
        hashedPassword,
        resetPasswordLink: 'default',
      }

      await db.postDocument({
        db: 'todo-vue-hapi',
        document: newUser,
      })

      return { message: 'Signup success. Please signin' }
    } catch (err) {
      console.error(err)
      return Boom.badImplementation()
    }
  }
}

exports.forgot = db => async (request, h) => {
  const { email } = request.payload

  try {
    const userList = await db.postAllDocs({
      db: 'todo-vue-hapi',
      includeDocs: true,
      startKey: 'auth',
    })

    const foundUser = userList.result.rows.find(
      user => user.id === `auth:${email}`
    )

    if (!foundUser) {
      return Boom.badRequest('User with that email does not exist.')
    }

    const user = await db.getDocument({
      db: 'todo-vue-hapi',
      docId: `auth:${email}`,
    })

    const token = jwt.sign(
      { _id: user.result._id },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: '10m',
      }
    )

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Link',
      html: `
        <h1>Please use the following link to reset your password</h1>
        <p>${process.env.CLIENT_URL}/reset/${token}/</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>${process.env.CLIENT_URL}</p>
      `,
    }

    user.result.resetPasswordLink = token

    await db.putDocument({
      db: 'todo-vue-hapi',
      docId: user.result._id,
      document: user.result,
      rev: user.result._rev,
    })

    await sgMail.send(emailData)

    return {
      message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
    }
  } catch (err) {
    console.error(err)
    return Boom.badImplementation()
  }
}

exports.reset = db => async (request, h) => {
  const { resetPasswordLink, newPassword } = request.payload

  if (resetPasswordLink !== 'default') {
    try {
      const decoded = jwt.verify(
        resetPasswordLink,
        process.env.JWT_RESET_PASSWORD
      )

      const user = await db.getDocument({
        db: 'todo-vue-hapi',
        docId: decoded._id,
      })

      const hashedPassword = crypto
        .createHmac('sha1', user.result.salt)
        .update(newPassword)
        .digest('hex')

      user.result.hashedPassword = hashedPassword
      user.result.resetPasswordLink = 'default'

      await db.putDocument({
        db: 'todo-vue-hapi',
        docId: user.result._id,
        document: user.result,
        rev: user.result._rev,
      })

      return {
        message: 'Great! Now you can login with your new password',
      }
    } catch (err) {
      console.error(err)
      return Boom.badImplementation()
    }
  }
}
