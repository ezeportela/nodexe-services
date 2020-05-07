const axios = require('axios');
const url = require('url');
const _ = require('lodash');
const https = require('https');
const config = require('config');

class HttpService {
  constructor({name, method, logger}) {
    this.name = name;
    this.method = method;
    this.bodyType = method === 'get' ? 'params' : 'data';
    this.logger = logger;
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

  async request(requestData) {
    const options = {
      name: this.name,
      method: this.method,
      url: this.getURI(requestData),
      headers: await this.getHeaders(requestData),
      [this.bodyType]: this.getRequestData(requestData),
    };

    this.logger('start_call_service', options);

    const ssl = this.getSSL();
    if (!_.isEmpty(ssl)) {
      const httpsAgent = new https.Agent(ssl);
      Object.assign(options, {httpsAgent});
    }

    const response = await axios(options);

    this.logger('end_call_service', {
      name: this.name,
      headers: await this.getHeaders(requestData),
      response: response.data,
    });

    return response;
  }
}

module.exports = HttpService;
