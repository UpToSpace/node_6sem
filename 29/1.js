const JrpcServer = require("jsonrpc-server-http-nats");
const server = new JrpcServer();

const arrayValidator = (params) => {
    if (!Array.isArray(params)) throw new Error("Params must be an array");
    params.forEach((param) => { if (!Number(param)) throw new Error("Params must be numbers"); });
    return params;
};

const binValidator = (params) => {
    if (!Array.isArray(params)) throw new Error("Params must be an array");
    if (params.length !== 2) throw new Error("Params must contain 2 items");
    if (!Number(params[0]) || !Number(params[1])) throw new Error("Param must be numbers");
    return params;
};

server.on("sum", (params, channel, response) => {
    let values;
    if (Array.isArray(params)) {
        values = params;
    } else if (typeof params === "object" && Array.isArray(params.values)) {
        values = params.values;
    } else {
        throw new Error("Invalid params format");
    }

    arrayValidator(values);
    const sum = values.reduce((total, value) => total + value);
    response(null, sum);
});

server.on("mul", (params, channel, response) => {
    let values;
    if (Array.isArray(params)) {
        values = params;
    } else if (typeof params === "object" && Array.isArray(params.values)) {
        values = params.values;
    } else {
        throw new Error("Invalid params format");
    }

    arrayValidator(values);
    const mul = values.reduce((total, value) => total * value);
    response(null, mul);
});

server.on("div", (params, channel, response) => {
    let values;
    if (Array.isArray(params)) {
        values = params;
    } else if (typeof params === "object") {
        const { a, b } = params;
        values = [a, b];
    } else {
        throw new Error("Params must be an array or an object");
    }

    binValidator(values);
    response(null, values[0] / values[1]);
});

server.on("proc", (params, channel, response) => {
    let values;
    if (Array.isArray(params)) {
        values = params;
    } else if (typeof params === "object") {
        const { a, b } = params;
        values = [a, b];
    } else {
        throw new Error("Params must be an array or an object");
    }

    binValidator(values);
    response(null, (values[0] / values[1]) * 100);
});


server.listenHttp(3000);
