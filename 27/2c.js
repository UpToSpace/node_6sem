const http = require('http');
const fs = require('fs');
const { ClientVerify } = require('./2m');
const file = fs.createWriteStream('./sign.txt');

const req3 = http.request({ host: 'localhost', path: '/resource', port: 8000, method: 'GET' }, (res) => {
    res.pipe(file);
    const req = http.request({ host: 'localhost', path: '/', port: 8000, method: 'GET', headers: { 'content-type': 'application/json' } }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk.toString('utf-8'); });
        res.on('end', () => {
            let signcontext = JSON.parse(data);
            var x = new ClientVerify(signcontext); 
            const rs = fs.createReadStream('./test.txt'); // error test.txt
            x.verify(rs, (result) => { console.log('result:', result); })
        });
    });
    req.on('error', (e) => { console.log('error:', e.message); });
    req.end();
});
req3.on('error', (e) => { console.log('error:', e.message); });
req3.end();