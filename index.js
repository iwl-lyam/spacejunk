import express from 'express'
import { exec } from "child_process";
import fs from "fs";
const app = express()
const port = 3000
let data = {}

app.get('/', (req, res) => {
    
    exec("curl https://www.space-track.org/ajaxauth/login -d 'identity=lyam.mosnier@itwithlyam.co.uk&password=ABCDEFGHIJKLMNO'", (error, stdout, stderr) => {
        console.log("LOGIN")
        exec("curl --limit-rate 100K --cookie cookies.txt https://www.space-track.org/basicspacedata/query/class/gp/limit/10/format/json > response.json", (error, stdout, stderr) => {
            console.log("LOADING")
                console.log("SENDING")
                fs.readFile('./response.json', (err, data) => {
                    data = JSON.parse(data.toString())
                });
                res.send(data)
                console.log("SENT")   
        })
    });
    

    
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})