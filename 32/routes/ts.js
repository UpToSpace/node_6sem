const tsRoute = require('express').Router();
const fs = require('fs');

let data = require('./../db/data') || [];

tsRoute.get('/', (request, response) => {
    response.json(data);
});

tsRoute.post('/', (request, response) => {
    const {id, name, phone} = request.body;
    const newTs = {id, name, phone};
    console.log(newTs)
    const targetTs = data.find(ts => ts.id === newTs.id);
    console.log(targetTs)
    if (!targetTs) {
        data.push(newTs);
        fs.writeFile('./db/data.json', JSON.stringify(data), (err) => {
            if (err) {
                console.log(err);
            }
        });
        response.json(newTs);
    }
    response.status(400).end();
});

tsRoute.put('/', (request, response) => {
    const {id, name, phone} = request.body;
    const newTs = {id, name, phone};
    const item = data.find(ts => ts.id === newTs.id);
    const targetTs = data.findIndex(ts => ts.id === newTs.id);
    if (id && targetTs !== -1) {
        data[targetTs].name = name;
        data[targetTs].phone = phone;
        fs.writeFile('./db/data.json', JSON.stringify(data), (err) => {
            if (err) {
                console.log(err);
            }
        });
        response.json(item);
    } else {
        response.status(400).end();
    }
});

tsRoute.delete('/', (request, response) => {
    console.log(request.query.id)
    console.log(data)
    const item = data.find(ts => ts.id === +request.query.id);
    const target = data.findIndex(ts => ts.id === +request.query.id);
    console.log(target)
    if (request.query.id && target !== -1) {
        data = data.filter((ts) => ts.id !== item.id);
        console.log(data)
        response.json(item);
        fs.writeFile('./db/data.json', JSON.stringify(data), (err) => {
            if (err) {
                console.log(err);
            }
        });
    } else {
        response.status(400).end();
    }
});


module.exports = tsRoute;
