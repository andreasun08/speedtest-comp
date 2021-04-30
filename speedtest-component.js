
async function getNetworkDownloadSpeed() {
    const NetworkSpeed = require('network-speed');
    const testNetworkSpeed = new NetworkSpeed();
    var baseUrl = 'https://eu.httpbin.org/stream-bytes/500000';
    var fileSizeInBytes = 500000;
    var speed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);
    return speed;
}

async function getNetworkUploadSpeed() {
    const NetworkSpeed = require('network-speed');
    const testNetworkSpeed = new NetworkSpeed();
    var options = {
        hostname: 'www.google.com',
        port: 80,
        path: '/catchers/544b09b4599c1d0200000289',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    var fileSizeInBytes = 2000000
    var speed = await testNetworkSpeed.checkUploadSpeed(options, fileSizeInBytes);
    return speed;
}

async function getPing() {
    var result = await ping('https://google.com');
    return result;
}

async function getServiceProvider() {
    const http = require('http');
    return http.get('http://ip-api.com/json/', (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        // Any 2xx status code signals a successful response but
        // here we're only checking for 200.
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.error(error.message);
            // Consume response data to free up memory
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                return parsedData.isp;
            } catch (e) {
                console.error(e.message);
            }
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
}


