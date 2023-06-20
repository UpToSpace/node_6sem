const redis = require('redis')

const client = redis.createClient();

let hsetter = async () => {
    console.time('hset');
    for(let i = 0; i < 10000; i++) {
       await client.hSet('myhash', i, JSON.stringify({id:i, val:'val-' + i}))
    }
    console.timeEnd('hset');
}

let hgetter = async () => {
    console.time('hget')
    for(let i = 0; i < 10000; i++) {
        await client.hGet('myhash', i.toString()); 
     }
     console.timeEnd('hget');
}

let hdeliter = async () => {
    for(let i = 0; i < 10000; i++) {
        await client.hDel('myhash', i.toString()); 
     }
}

let func = async () => {
    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect().then(() => console.log('client connected'));
    await hsetter();
    await hgetter();
    await hdeliter();
    await client.quit().then(() => console.log('client disconnected'));
}

func();