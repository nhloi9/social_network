const Redis = require('ioredis');

const redis = new Redis();
redis.on('connect', () => {
	console.log('redis connected');
});

module.exports = redis;
