const navPort = parseInt(window.location.port, 10);
let apiPort = '';
if (navPort && navPort !== 0 && navPort !== 80 && navPort !== 443) {
  apiPort = ':8000';
}

const API_ENDPOINT = window.location.protocol + '//api.' + window.location.hostname + apiPort;

export default {
  API_ENDPOINT,
};
