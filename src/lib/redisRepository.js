const RedisService = require('./redisService');
const _ = require('lodash');

const createRedisClient = (options) => new RedisService(options);

const getItem = async (instance, key, format = 'json') => {
  const item = await instance.getItem(key, format);
  if (_.isEmpty(item)) return null;

  return item;
};

const setItem = (instance, key, item, format = 'json') => {
  if (!_.isEmpty(item)) {
    instance.setItem(key, item, format);
  }
};

const removeItem = (instance, key) => instance.removeItem(key);

module.exports = {
  createRedisClient,
  getItem,
  setItem,
  removeItem,
};
