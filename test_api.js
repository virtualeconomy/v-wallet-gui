import tx_util from './src/utils/transaction.js'
import seed_lib from './src/libs/seed.js'
import {VSYS_PRECISION, TX_FEE, FEE_SCALE} from './src/constants.js'
var request = require('request')

//your seed here
const seed_str = 'type ethics salute ensure shove suffer jealous raise teach erode cinnamon loud orange hard snack'

//your api node for testing
var api_node_url = 'http://52.53.239.131:8080/api'


var key_pair = seed_lib.fromExistingPhrasesWithIndex(seed_str, 0).keyPair
const payment_url = api_node_url + '/vsys/broadcast/payment'
const lease_url = api_node_url + '/leasing/broadcast/lease'
const cancel_lease_url = api_node_url + '/leasing/broadcast/cancel'

const TX_TYPES = {
    PAYMENT: 2,
    LEASE: 3,
    CANCEL_LEASE: 4
}
var solve_response = (err, res, body) => {
    if (!err && res.statusCode === 200) {
        console.log('response:')
        console.log(body)
    } else {
        console.log("error: " + err)
        console.log("statusCode: " + res.statusCode)
    }
}

var post_tx_request = (tx_info, tx_type, tx_url) => {
    var api_data = tx_util.prepareForAPI(tx_info, key_pair, tx_type)
    console.log('tx data:')
    console.log(api_data)
    request({
        url: tx_url, 
        method: 'POST', 
        json: api_data
    }, solve_response)
}

var payment = (recipient, amount, attachment) => {
    const payment_tx_info = {
        recipient: recipient,
        amount: Number(( amount * VSYS_PRECISION).toFixed(0)),
        fee: TX_FEE * VSYS_PRECISION,
        feeScale: FEE_SCALE,
        timestamp: Date.now() * 1e6,
        attachment: attachment? attachment: ''
    }
    post_tx_request(payment_tx_info, TX_TYPES.PAYMENT, payment_url)
}

var lease = (recipient, amount) => {
    const lease_tx_info = {
        recipient: recipient,
        amount: Number((amount * VSYS_PRECISION).toFixed(0)),
        fee: TX_FEE * VSYS_PRECISION,
        feeScale: FEE_SCALE,
        timestamp: Date.now() * 1e6
    }
    post_tx_request(lease_tx_info, TX_TYPES.LEASE, lease_url)
}

var cancel_lease = (tx_id) => {
    const cancel_lease_tx_info = {
        txId: tx_id,
        fee: TX_FEE * VSYS_PRECISION,
        feeScale: FEE_SCALE,
        timestamp: Date.now() * 1e6
    }
    post_tx_request(cancel_lease_tx_info, TX_TYPES.CANCEL_LEASE, cancel_lease_url)
}

// you test code below:
payment('ATrvbrWqrS2Rm1sCwwgAPwhoM276wnY6kuf', 1000)
lease('ATrvbrWqrS2Rm1sCwwgAPwhoM276wnY6kuf', 1000)
// cancel_lease('4JKMXAAAfQtJrK3RZkzzXMudjkDrnFTsUBjqNSQmcK2N')



