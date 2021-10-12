import { Router } from 'itty-router'
import { error, json , missing } from 'itty-router-extras'

export { QrCodeDurableObject } from './QrCodeDurableObject.mjs'

const router = Router()

export default {
    fetch: router.handle,
}

router.get('/', (request, env) => {
  // now have access to the env (where CF bindings like durables, KV, etc now are)

  return json({ message: 'Hi there!' })
})

router.post('/scan', async (request, env) => {
    let id = env.QR.idFromName('A')
    let obj = env.QR.get(id)

    try {
        const content = await request.json()
        const code = content.code

        if (! code) {
            throw 'Error'
        }

        let response = await obj.fetch(code)
        let data = await response.json()
  
        return json({ success: true, code, scanCount: data.scanCount }, { status: 201 })
    } catch (err) {
        return error(400, 'Error')
    }
})

router.all('*', () => missing({ message: 'Page not found.' }))
