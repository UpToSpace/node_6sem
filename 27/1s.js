const { ServerDH } = require('./1m2');
const fs = require('fs');
const app = require('express')();
const bodyParser = require("body-parser");
const cipherFile = require('./1m').cipherFile;
var serverDH;
var serverSecret;
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
	serverDH = new ServerDH(1024, 3);
	const serverContext = serverDH.getContext();
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify(serverContext));
});

app.post('/setKey', (req, res, next) => {
	let body = '';
	req.on('data', chunk => { body += chunk.toString(); });
	req.on('end', () => {
		const clientContext = JSON.parse(body);
		if (clientContext.key_hex != undefined) {
			serverSecret = serverDH.getSecret(clientContext); // Вычисление общего секретного ключа
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			var buf = new Buffer.alloc(32);
			serverSecret.copy(buf, 0, 0, 32);
			const rs = fs.createReadStream('./file.txt');
			const ws = fs.createWriteStream('./encryption.txt');
			cipherFile(rs, ws, buf);
			res.end('Success');
		} else {
			res.statusCode = 409;
			console.log("error 409")
			res.end('Failure');
		}
	});
});

app.get('/resource', (req, res, next) => {
	if (serverSecret != undefined) {
		res.statusCode = 200;
		let rs2 = fs.createReadStream('./encryption.txt');
		rs2.pipe(res);
		rs2.on('close', () => { res.end(); });
	} else {
		res.statusCode = 409;
		console.log("error 409")
		res.end('Set key');
	}
});
app.listen(8000);