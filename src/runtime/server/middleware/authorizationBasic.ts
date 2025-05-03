import { type H3Event, defineEventHandler } from 'h3'

function returnUnauthorizedResponse(event: H3Event) {
  event.respondWith(
    new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    }),
  )
}

export default defineEventHandler((event) => {
  const auth = event.headers.get('authorization')
  if (!auth) return returnUnauthorizedResponse(event)

  const [type, base64Credentials] = auth.split(' ')
  if (type !== 'Basic' || !base64Credentials) return returnUnauthorizedResponse(event)

  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
  const [username, password] = credentials.split(':')
  if (username !== 'test' || password !== '123') {
    return returnUnauthorizedResponse(event)
  }
})
