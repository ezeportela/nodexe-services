const axios = require('axios');
const url = require('url');
const _ = require('lodash');
const https = require('https');
const config = require('config');

class HttpService {
  getName() {
    return '';
  }

  getMethod() {
    return 'get';
  }

  getConnection() {
    return config.get(`services.${this.name}.url`);
  }

  getURI(requestData = {}) {
    let uri = url.format(this.getConnection());
    for (const key of Object.keys(requestData)) {
      uri = uri.replace(`:${key}`, requestData[key]);
    }
    return uri;
  }

  async getHeaders(requestData) {
    return null;
  }

  getRequestData(requestData) {
    return requestData;
  }

  getSSL() {
    return {};
  }

  log(name, message) {
    console.log(name, message);
  }

  async request(requestData) {
    try {
      const bodyType = this.getMethod() === 'get' ? 'params' : 'data';

      const options = {
        name: this.name,
        method: this.method,
        url: this.getURI(requestData),
        headers: await this.getHeaders(requestData),
        [bodyType]: this.getRequestData(requestData),
      };

      this.log('start_call_service', options);

      const ssl = this.getSSL();
      if (!_.isEmpty(ssl)) {
        const httpsAgent = new https.Agent(ssl);
        Object.assign(options, {httpsAgent});
        this.log('service_ssl', 'the ssl has been loaded successfully');
      }

      const response = await axios(options);

      this.log('end_call_service', {
        name: this.name,
        headers: await this.getHeaders(requestData),
        response: response.data,
      });

      return response;
    } catch (err) {
      this.log('service_error', err);
      throw err;
    }
  }
}

module.exports = HttpService;
