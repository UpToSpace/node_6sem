const redis = require('redis')

const client = redis.createClient();

let setter = async () => {
    console.time('set');
    for(let i = 0; i < 10000; i++) {
       await client.set('i ' + i, i); 
    }
    console.timeEnd('set');
}

let incrementer = async () => {
    console.time('incr')
    for(let i = 0; i < 10000; i++) {
        await client.incr('i ' + i); 
     }
     console.timeEnd('incr');
}

let decrimenter = async () => {
    console.time('decr')
    for(let i = 0; i < 10000; i++) {
        await client.decr('i ' + i); 
     }
     console.timeEnd('decr');
}

let func = async () => {
    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect().then(() => console.log('client connected'));
    await setter();
    await incrementer();
    await decrimenter();
    await client.quit().then(() => console.log('client disconnected'));
}

func();