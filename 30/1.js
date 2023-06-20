const express = require('express');
const app = express();
const fs = require('fs');
app.use('/', express.static('.'));
app.get('/1', (req, res) => {res.sendFile(__dirname + '/1.html');});
app.get('/2', (req, res) => {res.sendFile(__dirname + '/2.html');});

let wasmCode = fs.readFileSync('./p.wasm');
let wasmImport = {};
let wasmModule = new WebAssembly.Module(wasmCode);
let wasmInstance = new WebAssembly.Instance(wasmModule, wasmImport);

app.get('/3', (req, res, next)=>{
    res.type('html').send(
        `sum(10, 2) = ${wasmInstance.exports.sum(10, 2)}<br>` +  
        `mul(3, 9) = ${wasmInstance.exports.mul(3, 9)}<br>` +
        `sub(5, 4) = ${wasmInstance.exports.sub(5, 4)}<br>`
    )
});

app.listen(3000);