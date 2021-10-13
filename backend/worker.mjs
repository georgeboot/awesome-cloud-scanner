import { Router } from 'itty-router'
import { error, json , missing } from 'itty-router-extras'
import { withCors } from './withCors'

export { QrCode } from './QrCode.mjs'

const router = Router()

export default {
    fetch: router.handle,
}

router.get('/', (request, env) => {
  // now have access to the env (where CF bindings like durables, KV, etc now are)

  return json({ message: 'Hi there!' })
})

router.options('/scan', withCors({ methods: 'POST' }))

router.post('/scan', async (request, env) => {
    try {
        const content = await request.json()
        const code = content.code

        if (! code) {
            throw 'No code set'
        }

        let id = env.QrCode.idFromName(code)
        let QrCodeInstance = env.QrCode.get(id)

        let response = await QrCodeInstance.fetch('https://dummy.com')
        let data = await response.json()
  
        return json({ success: true, code, scanCount: data.scanCount }, {
            status: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'content-type',
            },
        })
    } catch (err) {
        console.error(err)
        return error(400, 'Error during scan call')
    }
})

router.all('*', () => missing({ message: 'Page not found.' }))
