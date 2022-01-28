const isDev = process.env.NODE_ENV === 'development'

const BASE_URL = isDev
  ? 'http://localhost:5000'
  : 'https://todo-vue-hapi.herokuapp.com'

export const SIGNUP_URL = `${BASE_URL}/auth/signup`
