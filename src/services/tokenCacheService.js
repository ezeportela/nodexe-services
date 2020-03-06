const jwtDecode = require('jwt-decode');
const {redisRepository} = require('@nodexe/redis');
const _ = require('lodash');

const TokenCacheService = ({
  redisReadConnection,
  redisPrimaryConnection,
  key,
}) => {
  let readInstance;
  let primaryInstance;

  const getTokenFromCache = async () => {
    if (!readInstance) {
      readInstance = redisRepository.createRedisClient(redisReadConnection);
    }

    const item = await redisRepository.getItem(readInstance, key);

    if (
      (item && item.exp - 30 < new Date().getTime() / 1000) ||
      _.isNull(item)
    ) {
      return {};
    }

    return item;
  };

  const sendTokenToCache = (token) => {
    if (!primaryInstance) {
      primaryInstance = redisRepository.createRedisClient(
        redisPrimaryConnection,
      );
    }

    const decoded = jwtDecode(token);
    const item = {
      value: token,
      exp: decoded.exp,
    };
    redisRepository.setItem(primaryInstance, key, item);
    return item;
  };

  return {getTokenFromCache, sendTokenToCache};
};

module.exports = TokenCacheService;
