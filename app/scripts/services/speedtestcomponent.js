'use strict';

/**
 * @ngdoc service
 * @name speedtestComponentApp.speedTestComponent
 * @description
 * # speedTestComponent
 * Service in the speedtestComponentApp.
 */
var speedtestComponentApp = angular.module('speedtestComponentApp', []);
speedtestComponentApp.service('speedTestComponent', function ($window, $http) {
  // AngularJS will instantiate a singleton by calling "new" on this function

  return {
    getNetworkDownloadSpeed: async function () {
      try {
        const testNetworkSpeed = new $window.NetworkSpeedCheck();
        var baseUrl = 'https://eu.httpbin.org/stream-bytes/6000000';
        var fileSizeInBytes = 6000000;
        var speed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);
        return speed;
      } catch (e) {
        return e.message;
      }
    },
    getNetworkUploadSpeed: async function () {
      const testNetworkSpeed = new $window.NetworkSpeedCheck();
      var options = {
        hostname: 'www.google.com',
        port: 80,
        path: '/catchers/544b09b4599c1d0200000289',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      var fileSizeInBytes = 4000000;
      var speed = await testNetworkSpeed.checkUploadSpeed(options, fileSizeInBytes);
      return speed;
    },
    getServiceProvider: async function () {
      return new Promise(function (resolve, reject) {
        var startTime = new Date().getTime();
        $http.get('http://ip-api.com/json/').then(function (res) {
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
        }).catch(function (e) {
          console.error(`Got error: ${e.message}`);
          reject(e.message);

        });
      });

    }
  };
});
