const redis = require('redis')

const client = redis.createClient();

let channelName = 'mychannel';

let listener = (message, channel) => {
    console.log(channel + ': ' + message);
    client.unsubscribe(channelName, listener);
    client.quit().then(() => console.log('client disconnected'));
}

let func = async () => {
    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect().then(() => console.log('client connected'));
    await client.subscribe(channelName, listener);
}

func();

