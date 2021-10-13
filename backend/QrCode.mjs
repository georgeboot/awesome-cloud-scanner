import { json } from "itty-router-extras";

export class QrCode {
    constructor(state, env) {
        this.state = state
        // `blockConcurrencyWhile()` ensures no requests are delivered until initialization completes.
        this.state.blockConcurrencyWhile(async () => {
            let stored = await this.state.storage.get('scans');
            this.scans = stored || 0;
        })
    }

    async fetch(request) {
        this.scans++

        this.state.storage.put('scans', this.scans)

        return json({ success: true, scanCount: this.scans }, { status: 201 })
    }
}