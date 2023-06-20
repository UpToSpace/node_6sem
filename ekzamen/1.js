const express = require('express');
const app = express();
const cookieParser = require("cookie-parser")
app.use(express.text());
app.use(cookieParser())

app.post('/', (req, res) => {
    const key = req.body;
    if (key.length === undefined) {
        return res.status(400).send('cookie key is not given');
    }

    if (!req.cookies || !req.cookies[key]) {
        return res.status(400).send('theres no such cookie');
    }

    res.clearCookie(key);
    res.send('cookie cleared')
})

app.use((req, res, next) => {
    if(req.cookies && req.cookies['mycookie']) {
        res.type('json').send(req.cookies['mycookie']);
    } else {
        res.setHeader('Set-Cookie', 'mycookie=Hey; Max-Age=25;')
        next();
    }
});

app.listen(3000)