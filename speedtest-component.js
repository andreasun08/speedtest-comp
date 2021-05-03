
async function getNetworkDownloadSpeed() {

    try {
        const NetworkSpeed = require('network-speed');
        const testNetworkSpeed = new NetworkSpeed();
        var baseUrl = 'https://eu.httpbin.org/stream-bytes/6000000';
        var fileSizeInBytes = 6000000;
        var speed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);
        return speed;
    } catch (e) {
        return e.message;
    }

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
    var fileSizeInBytes = 4000000
    var speed = await testNetworkSpeed.checkUploadSpeed(options, fileSizeInBytes);
    return speed;
}

async function getServiceProvider() {
    return new Promise(function (resolve, reject) {
        const http = require('http');
        var startTime = new Date().getTime();
        http.get('http://ip-api.com/json/', (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];
            var endTime = new Date().getTime();

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
                reject('something went wrong');
            }

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    resolve({ isp: parsedData.isp, ping: (endTime - startTime) / 10 });
                } catch (e) {
                    console.error(e.message);
                    reject(e.message);
                }
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
            reject(e.message);

        });
    });

}

module.exports = { getNetworkDownloadSpeed, getNetworkUploadSpeed, getServiceProvider };




