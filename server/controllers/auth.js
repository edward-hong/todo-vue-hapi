exports.signup = db => (request, h) => {
  console.log(request.payload)
  return { data: 'you hit the signup endpoint' }
}
