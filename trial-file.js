import './speedtest-component.js';

getNetworkDownloadSpeed().then(function (params) {
    console.log('download');
    console.log(params);
});

getNetworkUploadSpeed().then(function (params) {
    console.log('upload');
    console.log(params);
});

getServiceProvider().then(function (params) {
    console.log(params.isp);
    console.log(params.ping);
});