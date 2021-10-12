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