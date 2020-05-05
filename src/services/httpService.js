const axios = require('axios');
const url = require('url');
const _ = require('lodash');
const https = require('https');

class HttpService {
  constructor({name, method, logger}) {
    this.name = name;
    this.method = method;
    this.bodyType = method === 'get' ? 'params' : 'data';
    this.logger = logger;
  }

  getConnection() {
    throw new Error('the connection has not implemented yet.');
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
      method: this.method,
      url: this.getURI(requestData),
      headers: await this.getHeaders(requestData),
      [this.bodyType]: this.getRequestData(requestData),
    };

    this.logger('start_call_service', options);

    const httpsAgent = new https.Agent(this.getSSL());

    if (!_.isEmpty(httpsAgent)) {
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
