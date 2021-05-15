const Boom = require('@hapi/boom')
const sgMail = require('@sendgrid/mail')
const jwt = require('jsonwebtoken')

sgMail.setApiKey(process.env.SENDGRID_KEY)

exports.signup = db => async (request, h) => {
  const { name, email, password } = request.payload

  try {
    const userList = await db.list()

    const foundUser = userList.rows.find(user => user.id === `auth:${email}`)

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
        <p>${process.env.CLIENT_URL}/activate/${token}</p>
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
    return Boom.badImplementation()
  }
}
