'use strict';

/**
 * @ngdoc service
 * @name speedtestComponentApp.speedTestComponent
 * @description
 * # speedTestComponent
 * Service in the speedtestComponentApp.
 */
var speedtestComponentApp = angular.module('speedtestComponentApp');
speedtestComponentApp.service('speedTestComponent', function ($window, $http, jsBandwidth) {
  // AngularJS will instantiate a singleton by calling "new" on this function

  return {
    getNetworkDownloadSpeed: async function () {
      try {
        const testNetworkSpeed = new $window.NetworkSpeed();
        var baseUrl = 'https://eu.httpbin.org/stream-bytes/6000000';
        var fileSizeInBytes = 6000000;
        var speed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);
        return speed;
      } catch (e) {
        return e.message;
      }
    },
    getNetworkUploadSpeed: async function () {
      const testNetworkSpeed = new $window.NetworkSpeed();
      var options = {
        hostname: 'http://httpbin.org/',
        // port: 80,
        // path: '/catchers/544b09b4599c1d0200000289',
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
          console.log(res);
          var endTime = new Date().getTime();
          resolve({ isp: res.data.isp, ping: (endTime - startTime) / 10 });
        }).catch(function (e) {
          console.error(`Got error: ${e.message}`);
          reject(e.message);

        });
      });

    }
  };
});
