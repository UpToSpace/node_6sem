const app = require('express')();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const session = require('express-session');

passport.use(new GoogleStrategy({
    clientID: '831175188414-j8nujdopgdsbr6vsgvihniprlnc73kan.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback',
},
    function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    })
);

passport.serializeUser((user, done) => {
    console.log('displayName: ' + user.displayName);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/24-01.html');
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect("/resource");
    }
);

app.get('/resource', (req, res, next) => {
    if (req.user) res.status(200).send('RESOURCE ' + req.user._raw);
    else res.redirect('/login');
});

app.get("/logout", (req, res) => {
    req.session.logout = true;
    req.logout(function (err) {
        if (err) {
            console.error(err);
        }
        res.redirect("/login");
    });
});

app.use(function (req, res) {
    res.status(404).send('ERROR 404: not found ' + req.url);
});

app.listen(3000, () => console.log('http://localhost:3000/login'));

