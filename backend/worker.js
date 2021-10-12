import { Router } from 'itty-router'
import { error, json , missing } from 'itty-router-extras'

const router = Router()

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

export default {
    fetch: router.handle,
}

export class QrCodeDurableObject {
    constructor(state, env) {
        this.state = state;
        // `blockConcurrencyWhile()` ensures no requests are delivered until initialization completes.
        this.state.blockConcurrencyWhile(async () => {
            let scans = await this.state.storage.get('scans');
            this.scans = scans || [];
        })
    }

    async fetch(code) {
        this.scans[code] = this.scans[code]++ ?? 0

        await this.state.storage.put('scans', this.scans);

        return json({ scanCount: this.scans[code], code })
    }
}