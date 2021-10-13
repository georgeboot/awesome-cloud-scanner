import Alpine from 'alpinejs'
import './app.css'
import BarcodeDetector from "barcode-detector"

window.Alpine = Alpine

// polyfill unless already supported
if (!("BarcodeDetector" in window)) {
    window.BarcodeDetector = BarcodeDetector
  }

Alpine.data('page', () => ({
    scannerEnabled: false,
    result: null,
    barcodeDetector: null,
    workerUrl: 'https://awesome-cloud-scanner-backend.gg.workers.dev/scan',
    maxScansAllowed: 1,

    async onScan({ rawValue: code }) {
        const response = await fetch(this.workerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        })
        const responseData = await response.json()
        this.result = responseData.scanCount

        this.scheduleNextScan(2500)
    },

    onError(errorMessage) {
        // Log an error if one happens
        console.error(errorMessage)
            
        this.scheduleNextScan()
    },

    scheduleNextScan(delay = 200) {
        setTimeout(() => {
            this.result = null
            this.detectCode()
        }, delay)
    },

    async initScanner() {
        if (! navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            return
        }
        const constraints = { 
            video: {
                facingMode: 'environment',
            },
            audio: false,
        }
        
        // Start video stream
        this.$refs['video'].srcObject = await navigator.mediaDevices.getUserMedia(constraints)
        this.barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] })

        this.scannerEnabled = true

        this.detectCode()
    },

    async detectCode() {
        try {
            const codes = await this.barcodeDetector.detect(this.$refs['video'])
            
            if (codes.length === 0) return this.scheduleNextScan()

            this.onScan(codes[0])
        } catch (err) {
            this.onError(err)
        }
    },
}))
 
Alpine.start()
