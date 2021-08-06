const http = require("http");
const fs = require("fs");
const server = http.createServer((req, res)=> {
    // console.log(req.url);
    if (req.url == "/"){
    res.end("hello from the other sides mridul");
    }else if (req.url == "/about"){
    res.end("hello from the about us");
    }else if (req.url == "/contact"){
    res.end("hello from the contact us side")
    }else if (req.url == "/userapi"){
        fs.readFile(`${__dirname}/userapi.json`,"utf-8",(err,data)=>{
            console.log(data);
            res.end(data);
            

        });
        
    
    
    }else {
    res.writeHead(404, {"content-type": "text/html"});
    res.end("<h1> 404 error pages. page dosen't exist </h1>");

    }
});
server.listen(9000, "127.0.0.1",() => {
    console.log("listening to the port no 9000");
});