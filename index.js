import express from 'express'
import spacetrack from 'spacetrack';
import util from 'util';
import { exec } from "child_process";
import satellite from "satellite.js";
import fs from "fs";
const app = express()
const port = 3000
let data = {}
let prevLimit = 0;

async function get() {
    
        
}

app.get('/', (req, res) => res.send(`<h1>Space Tracker</h1><h2>Track objects in space</h2><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoQbFkIcx7vYEl95QxtXTywP7hVlkrsNQQNQ&usqp=CAU" />`))
app.get('/:limit', async (req, res) => {
        const limit = req.params.limit

        console.log("GETTING")
        console.log("SEARCHING")
        exec(`curl --limit-rate 100K --cookie cookies.txt https://www.space-track.org/basicspacedata/query/class/gp/limit/${limit}/format/json > response.json`, (error, stdout, stderr) => {
            fs.readFile('./response.json', (err, data) => {
                let readable = ""
                console.log("WE'RE IN")
                if (!data.toString()) res.send("Timed out, please login")
                data = JSON.parse(data.toString())
                console.log(readable)
                let lists = []
                data.forEach(element => {
                    if (readable === "Timed out, please refresh") return;
                    if (element.TLE_LINE0 === "0 TBA - TO BE ASSIGNED") return;
                    console.log(element)
                    const values = {zero: element.TLE_LINE0, one: element.TLE_LINE1, two: element.TLE_LINE2}
                    const line = `<br />Name: ${values.zero}<br />TLE:<br />${values.zero}<br />${values.one}<br />${values.two}<br /><br />Apoapsis: ${element.APOAPSIS}<br />Periapsis: ${element.PERIAPSIS}<br />Inclination: ${element.INCLINATION}<br /><br />`
                    const tleProper = `${values.zero}\n${values.one}\n${values.two}`
                    readable += line
                    lists[values.zero] = tleProper
                })
                console.log(readable)
                if (readable === "") readable = "No assigned results found, try a larger limit"
                console.log("done")
                res.send(`
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <script src="https://files.worldwind.arc.nasa.gov/artifactory/web/0.9.0/worldwind.min.js" type="text/javascript"></script>
                            <title>Space Junk Tracker</title>
                        </head>
                        <body>
                            <h1>Space Tracker</h1>
                            <h4>${readable}</h4>
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoQbFkIcx7vYEl95QxtXTywP7hVlkrsNQQNQ&usqp=CAU" />
                        </body>
                    </html>
                `)
            })
        })
        console.log("SENT") 
    
    

    
})
app.get("/:limit/json", (req, res) => {
    const limit = req.params.limit

    console.log("GETTING")
    console.log("SEARCHING")
    exec(`curl --limit-rate 100K --cookie cookies.txt https://www.space-track.org/basicspacedata/query/class/gp/limit/${limit}/format/json > response.json`, (error, stdout, stderr) => {
        fs.readFile('./response.json', (err, data) => {
            let readable = ""
            console.log("WE'RE IN")
            data = JSON.parse(data.toString())
            console.log("done")
            res.send(data)
        })
    })
    console.log("SENT") 
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})