const express = require('express');
const  bodyParser = require("body-parser");
const  fs  =  require ("fs");
const jwt = require("jsonwebtoken");
const { checkUser, createUser,CheckById } = require('./Service');
const cookieParser = require("cookie-parser");
const{ AddTokenToBlackList, tokenInBlackList } =require("./redisService.js");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/auth/register', (req, res) => {
    const rs = fs.createReadStream('register.html');
    rs.pipe(res);
});


app.post('/auth/register', async (req, res) => {
    const { username, password } = req.body;

   const userFromBd = await getUser(username)

    if (!userFromBd) {
        await createUser(username, password);
        res.redirect('/auth/login');
    }

    else {
        res.status(400).json({ message: "User already exists" });
    }
});

app.get('/auth/login', (req, res) => {
    const rs = fs.createReadStream('login.html');
    rs.pipe(res);
});


app.post('/auth/login', async  (req, res) => {
    const { username, password } = req.body;
    const user = await checkUser(username, password)

    if (user) {

        const refreshToken = jwt.sign({id: user.id},  process.env.REFRESH_TOKEN_SECRET, { expiresIn: "24h" });
        const accessToken = jwt.sign({id: user.id },  process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
   
        res.cookie('refreshToken', refreshToken, { path: '/auth/',httpOnly: true, sameSite: "strict" });
        res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: "strict", });
        res.redirect('/auth/resource');
    }

    else {

        res.redirect('/auth/login');
    }
});


app.get(`/auth/refresh`, async (req, res, next) => {

    const { refreshToken, accessToken } = req.cookies;

    if (!refreshToken || !accessToken) 
        return res.status(401).json({ message: "Token not valid" });


    if (!await tokenInBlackList(refreshToken)) {
        
        try {

        const decoded = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);  

        const { id } = decoded;

        const user = await CheckById(id);

        if (!user) {
             return res.status(401).json({ error: 'Refresh token invalid' });
        } else {
        await AddTokenToBlackList(refreshToken);

        const newAccessToken = jwt.sign({ id: user.id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
        const newRefreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "24h" });

          res.cookie('accessToken', newAccessToken, { httpOnly: true, sameSite: "strict", });
          res.cookie('refreshToken',newRefreshToken, { path: '/auth/' });
       
        res.redirect('/auth/resource');
        }
    }
        catch (err){
            if (err instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ message: 'Invalid token' });
              }
        }

    }


});

app.get('/auth/logout', async (req, res) => {

    const { refreshToken } = req.cookies;
    console.log(req.cookies);
    
    await AddTokenToBlackList(refreshToken);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { path: '/auth/' });
    res.redirect('/auth/login');
});

app.get('/auth/resource',async  (req, res, next) => {
    const { accessToken} = req.cookies;
   
     if ( !accessToken) 
     {
        return res.status(401).json({ message: "Unauthorithed" });
     }
    else {
        try {
        const decoded =  await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const { id } = decoded;
        const user = await CheckById(id);
        res.json('resource for '+ user.username)
        }
        catch (err) {
            if (err instanceof jwt.JsonWebTokenError) {
              return res.status(401).json({ message: 'Invalid token' });
            }

    }
}
});

app.use((req, res, next) => {
    res.status(404).send('Not found');
});


app.listen(3000, () => {
    console.log(`Server started at http://localhost:3000`);
});
