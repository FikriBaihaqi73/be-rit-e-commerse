import http from "http";
import hello from "./hello.js";
import moment from "moment";
import orang from "./orang.js";

const server = http
    .createServer((req, res) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        // res.write(hello() + "\n");
        // res.write(moment().calendar());
        // res.write(JSON.stringify({
        //     name: "John",
        //     age: 30,
        //     city: "New York"
        // }));
        const url = req.url;
        if (url === "/") {
            res.write(hello() + "\n");
        } else if (url === "/orang"){
            res.write(orang())
        }else{
            res.write(JSON.stringify({
                message: "404 Not Found"
            }))
        }
        res.end();
    })
    .listen(5000, () => {
        console.log("Server running at http://localhost:5000");
    });