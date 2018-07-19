const apiProto = window.location.protocol;
const apiHostname = window.location.hostname;
const navPort = parseInt(window.location.port, 10);
let apiPort = '';
let apiPrefix = 'api.';
if (navPort && navPort !== 0 && navPort !== 80 && navPort !== 443) {
  apiPort = ':8000';
}
if (apiHostname.startsWith('192.168')
  || apiHostname.startsWith('127.')
  || apiHostname === 'localhost') {
  apiPrefix = '';
}

const API_ENDPOINT = `${apiProto}//${apiPrefix}${apiHostname}${apiPort}`;

export default {
  API_ENDPOINT,
};
