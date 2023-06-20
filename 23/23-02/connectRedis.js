const redis =require('redis');
async function ConnectToRedis() {
    const client = redis.createClient({host: '127.0.0.1',
    port: 6379});
    client.on('error', (err) => {
        console.log('Error ' + err);
    });
    await client.connect();
    return client;
}

module.exports={ConnectToRedis}