const redis = require('redis')

const client = redis.createClient();
let setter = async () => {
    console.time('set');
    for(let i = 0; i < 10000; i++) {
       await client.set('i ' + i, 'value ' + i); 
    }
    console.timeEnd('set');
}

let getter = async () => {
    console.time('get')
    for(let i = 0; i < 10000; i++) {
        await client.get('i ' + i); 
     }
     console.timeEnd('get');
}

let deliter = async () => {
    console.time('del')
    for(let i = 0; i < 10000; i++) {
        await client.del('i ' + i); 
     }
     console.timeEnd('del');
}

let func = async () => {
    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect().then(() => console.log('client connected'));
    await setter();
    await getter();
    await deliter();
    await client.quit().then(() => console.log('client disconnected'));
}

func();