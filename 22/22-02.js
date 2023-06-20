const express = require('express');
const {DigestStrategy} = require('passport-http');
const auth = require('./auth');
const session = require('express-session');
const passport = require("passport");

passport.use('digest', new DigestStrategy(
    {qop: 'auth'}, 
    (username, done) => {
        const user = auth.getUser(username);

        if (user) {
            return done(null, user, user.password);
        }

        return done(null, false);

    }
));

const app = express();

app.use(passport.initialize({}));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.get('/login',
    (req, res, next) => {

        if (req.session.logout && req.headers.authorization) {
            req.session.logout = false;
            delete req.headers.authorization;
        }
        next();
    }, passport.authenticate('digest', {session: false, successRedirect: '/resource'}),
);

app.get('/logout', (req, res) => {
    req.session.logout = true;
    res.redirect('/login');
});

app.get('/resource',
    passport.authenticate('digest', {session: false, failureRedirect: "/login"}),
    (req, res) => {
        res.send('RESOURCE');
    }
);

app.use((req, res) => {
    res.status(404).send('Not found');
});

app.listen(3000, () => {
    console.log('http://localhost:3000');
});