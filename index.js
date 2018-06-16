/**
 * This is my first nodejs attempt at creating a simple server to manage 
 * my Plex service and use it as a switch in home-assistant:
 * @link{https://www.home-assistant.io/components/switch.rest/}
 */

const express = require('express');
const app = express();
const plex = require('./plex');

const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world!")
});

/**
 * Checks for status with GET
 */
app.get("/api/plex", (req, res) => {
    const service = plex();

    res.send({
        status: "OK",
        message: service.status()
    })
});

/**
 * Changes status
 */
app.post("/api/plex", (req, res) => {
    const data = req.body;
    const service = plex();
    const shouldEnable = data.activate === "true";

    // home assistant is sending a string rather than boolean
    if(shouldEnable) {
        service.enable();
    } else {
        service.disable();
    }

    res.send({ 
        status: "OK",
        message: service.status(),
    });
});

/**
 * All-in-one GET methods
 */
app.get("/api/plex/:action", (req, res) => {
    const action = req.params.action;
    const fn = plex();
    const data = fn[action]();

    if('error' in data) {
        res.status(500).json({
            "status": 'KO',
            "message": data
        });
    } else {
        res.json({
            "status": 'OK',
            "message": data
        });
    }
})

// do I need to comment this? 
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})