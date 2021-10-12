import { Router } from 'itty-router'
import { error, json } from 'itty-router-extras'

const router = Router()

router.get('/', (request, env) => {
  // now have access to the env (where CF bindings like durables, KV, etc now are)

  return new Response('Hi there!')
})

router.post('/scan', async (request, env) => {
    const content = await request.json()
    const code = content.code

    return code ? json({ success: true, code }) : error(400, 'Validation error')
})

router.all('*', () => error(404, { error: 'Page not found.' }))

export default {
    fetch: router.handle,
}