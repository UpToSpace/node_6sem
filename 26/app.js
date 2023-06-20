const app = require("express")();
const https = require("https");
const fs = require("fs");

const PORT = 3001;

let options = {
  key: fs.readFileSync(`${__dirname}/LAB.key`).toString(),
  cert: fs.readFileSync(`${__dirname}/LAB.crt`).toString(),
};

app.get("/", (req, res) => {
  res.send("Https works");
});

https
  .createServer(options, app)
  .listen(PORT, () => {
    console.log(`https://LAB26-KVS:${PORT}`);
  })
  .on("error", (e) => {
    console.log(`Error: ${e.code}`);
  });
