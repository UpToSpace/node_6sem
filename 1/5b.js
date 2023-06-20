const redis = require('redis')

const client = redis.createClient();
let channelName = 'mychannel';

let func = async () => {
    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect().then(() => console.log('client connected'));
    await client.publish(channelName, 'hello').then(() => console.log('message published'));
    await client.quit().then(() => console.log('client disconnected'));
}

func();