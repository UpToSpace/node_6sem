const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const users = require('./user.json');
const path = require('path');
const app = express();


app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        return done(null, user);
    } else {
        return done(null, false, { message: 'Invalid username or password.' });
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    const foundUser = users.find(u => u.username === user.username);
    if (foundUser) {
        done(null, foundUser);
    } else {
        done(new Error('User not found'));
    }
});



app.use(bodyParser.urlencoded({ extended: true }));


const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};


app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/resource');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/resource',
    failureRedirect: '/login'
}));

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
        }
    });
    res.send('Logout success');
});

app.get('/resource', isAuthenticated, (req, res) => {
    res.send(`RESOURCE. Authenticated user: ${req.user.username}`);
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});


app.listen(3000, () => {
    console.log('http://localhost:3000/login');
});
