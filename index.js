

const BRIDGE_URL = 'https://petbaik.github.io/waellet-ledger-bridge/ledger.html'


class LedgerBridge  {

    constructor() {
        this.bridgeUrl = BRIDGE_URL
        this._setupIframe()
    }

    getAddress(accountIdx) {
        return new Promise((resolve, reject) => {
            this._sendMessage({
                action: 'ledger-get-address',
                params: {
                    accountIdx
                },
            },
            ({success, payload}) => {
                if (success) {
                    resolve(payload.address)
                } else {
                    reject(payload.error || 'Unknown error')
                }
            })
        })
    }

    signTransaction(accountIdx,tx,networkdId) {
        return new Promise((resolve, reject) => {
            this._sendMessage({
                action: 'ledger-sign-transaction',
                params: {
                    accountIdx,
                    tx,
                    networkdId
                },
            },
            ({success, payload}) => {
                if (success) {
                    resolve(payload)
                } else {
                    reject(payload.error || 'Unknown error')
                }
            })
        })
    }

    _setupIframe () {
        this.iframe = document.createElement('iframe')
        this.iframe.src = this.bridgeUrl
        document.head.appendChild(this.iframe)
    }

    _getOrigin () {
        const tmp = this.bridgeUrl.split('/')
        tmp.splice(-1, 1)
        return tmp.join('/')
    }

    _sendMessage (msg, cb) {
        msg.target = 'LEDGER-IFRAME'
        this.iframe.contentWindow.postMessage(msg, '*')
        window.addEventListener('message', ({ origin, data }) => {
            if (origin !== this._getOrigin()) return false
            if (data && data.action && data.action === `${msg.action}-reply`) {
                cb(data)
            }
        })
    }

}

let ledger = new LedgerBridge()