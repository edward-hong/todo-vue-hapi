const isDev = process.env.NODE_ENV === 'development'

const BASE_URL = isDev
  ? 'http://localhost:5000'
  : 'https://todo-vue-hapi.herokuapp.com'

export const SIGNUP_URL = `${BASE_URL}/auth/signup`
export const SIGNIN_URL = `${BASE_URL}/auth/signin`
export const ACTIVATE_URL = `${BASE_URL}/auth/activate`

export const TODOS_URL = `${BASE_URL}/todo/list`
export const ADD_TODO_URL = `${BASE_URL}/todo/add`
export const COMPLETE_TODO_URL = `${BASE_URL}/todo/complete`
export const EDIT_TODO_URL = `${BASE_URL}/todo/edit`
export const DELETE_TODO_URL = `${BASE_URL}/todo/remove`
