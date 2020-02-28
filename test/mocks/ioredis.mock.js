const {StorageService} = require('@nodexe/common');

class Redis {
  constructor() {
    this.storage = new StorageService('redis');
  }

  async get(key) {
    return this.storage.getItem(key);
  }

  async set(key, value) {
    return this.storage.setItem(key, value);
  }

  async unlink(key) {
    this.storage.removeItem(key);
  }

  async disconnect() {}
}

module.exports = Redis;
