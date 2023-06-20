const {ServerSign} = require('./2m');
const fs=require('fs');
const app = require('express')();
let rs=fs.createReadStream('./file.txt');

app.get('/', (req, res, next) => {
    const ss = new ServerSign();
    ss.getSignContext(rs, (signcontext) => { // файл file.txt, контекст подписи
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(signcontext));
    });
});  

app.get('/resource',(req,res,next)=>
{
    try{
        let rs2=fs.createReadStream('./file.txt');
        rs2.pipe(res);
        rs2.on('close',()=>{res.end();});
    }
    catch(e){
        console.log("error 409")
		res.status(409).json({ error: "Something run wrong" });
    }
});

app.listen(8000);