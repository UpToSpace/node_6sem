const http = require('http');
const { ClientDH } = require('./1m2');
const fs = require('fs');
const decipherFile = require('./1m').decipherFile;
let parms;

var clientDH;
const req = http.request({ host: 'localhost', path: '/', port: 8000, method: 'GET', headers: { 'content-type': 'application/json' } }, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk.toString('utf-8'); });
    res.on('end', () => {
        let serverContext = JSON.parse(data);
        clientDH = new ClientDH(serverContext);
        let clientContext = clientDH.getContext();
        parms = JSON.stringify(clientContext); // here 409 {} instead of clientContext

        const req2 = http.request({ host: 'localhost', path: '/setKey', port: 8000, method: 'POST' }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk.toString('utf-8'); });
            res.on('end', () => {
                if (res.statusCode != 409) {
                    const file = fs.createWriteStream('./decryption.txt');

                    const req3 = http.request({ host: 'localhost', path: '/resource', port: 8000, method: 'GET' }, (res) => {
                        if (res.statusCode != 409) {
                            var buf = new Buffer.alloc(32);
                            let clientSecret = clientDH.getSecret(serverContext);
                            clientSecret.copy(buf, 0, 0, 32)// Копирование первых 32 байт из `clientSecret` в `buf`
                            decipherFile(res, file, buf);
                        }
                    });
                    req3.on('error', (e) => { console.log('error:', e.message); });
                    req3.end();
                }
            });
        });
        req2.on('error', (e) => { console.log(' error:', e.message); });
        console.log(parms)
        req2.write(parms);
        req2.end();
    });
});
req.on('error', (e) => { console.log('error:', e.message); });
req.end();
