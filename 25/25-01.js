const app = require("express")(); // admin adminadmin; user1 useruser
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const express = require("express");
const { accessKey, refreshKey } = require("./security/jwtKeys");
const { Admin, Guest, User } = require("./security/roles");
const { GetAbilityFor } = require("./security/privilegies");
const homeController = require("./route/route");
const apiController = require("./route/api");

app.use(cookieParser("secret")); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.cookies.accessToken) {
    jwt.verify(req.cookies.accessToken, accessKey, (err, payload) => {
      if (err) {
        res.clearCookie("accessToken");
        res.redirect("/login");
      }
      req.payload = payload; // token to req
    });
  } else {
    req.payload = { role: Guest };
  }

  req.ability = GetAbilityFor(req); // get user privs
  next();
});

app.get("/resource", (req, res) => {
  if (req.payload)
    res
      .status(200)
      .send(
        `Resource for id:${req.payload.id}, username:${req.payload.username}, role:${req.payload.role}`
      );
  else res.status(401).send("user unauthorized");
});

app.use("/api", apiController);
app.use("/", homeController);

app.listen(3000, () => console.log("http://localhost:3000/login"));
