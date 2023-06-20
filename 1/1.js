const createClient = require('redis').createClient;

const client = createClient();
let func = async () => {
    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect().then(() => console.log('client connected'));

    await client.set('name', 'Lera');
    const value = await client.get('name');
    console.log(value);
    await client.quit().then(() => console.log('client disconnected'));
}

func();