let fetch = {}
if (typeof window === 'undefined') {
    fetch = require('node-fetch')
} else {
    fetch = window.fetch
}

const usePowSrvIO = (iotaLibJsInstance, timeoutMs, apiKey) => {
    iotaLibJsInstance.api.attachToTangle = async (
        trunkTransaction,
        branchTransaction,
        minWeightMagnitude,
        trytes,
        callback
    ) => {
        // inputValidator: Check if correct hash
        if (!iotaLibJsInstance.valid.isHash(trunkTransaction)) {

            return callback(new Error("You have provided an invalid hash as a trunk/branch: " + trunkTransaction), null);
        }

        // inputValidator: Check if correct hash
        if (!iotaLibJsInstance.valid.isHash(branchTransaction)) {

            return callback(new Error("You have provided an invalid hash as a trunk/branch: " + branchTransaction), null);
        }

        // inputValidator: Check if int
        if (!iotaLibJsInstance.valid.isValue(minWeightMagnitude)) {

            return callback(new Error("One of your inputs is not an integer"), null);
        }

        // inputValidator: Check if array of trytes
        if (!iotaLibJsInstance.valid.isArrayOfTrytes(trytes)) {

            return callback(new Error("Invalid Trytes provided"), null);
        }
        if ((!timeoutMs) || (timeoutMs < 0)) {
            timeoutMs = 5000
        }

        // Send ATT call to powsrvATT
        let resp = await powsrvATT(
            trunkTransaction,
            branchTransaction,
            minWeightMagnitude,
            trytes,
            apiKey,
            timeoutMs
        );
        if ((resp[0]) != null) {
            callback(resp[0], null);
        } else {
            callback(null, resp[1].trytes);
        }
    };
};

const powsrvATT = async (trunkTransaction, branchTransaction, minWeightMagnitude, trytes, apiKey, timeoutMs) => {
    var command = {
        'command'             : 'attachToTangle',
        'trunkTransaction'    : trunkTransaction,
        'branchTransaction'   : branchTransaction,
        'minWeightMagnitude'  : minWeightMagnitude,
        'trytes'              : trytes
    };

    let params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-IOTA-API-Version': '1'
        },
        body: JSON.stringify(command),
        timeout: timeoutMs
    };
    if (apiKey) params.headers['Authorization'] = 'powsrv-token ' + apiKey;

    try {
        const response = await fetch(`https://api.powsrv.io:443`, params);
        if (response.status != 200) {
            if ((response.status > 300) && (response.status < 600)) {
                // 3xx-5xx responses are NOT network errors
                const msg = await response.json();
                return [msg.message, null];
            }
            return [response.statusText, null];
        } 
        const data = await response.json();
        return [null, data];
    }
    catch(e) {
        return [e, null];
    }
}
