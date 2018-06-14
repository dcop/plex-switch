const express = require('express');
const app = express();
const plex = require('./plex');

const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world!")
});

app.post("/api/plex", (req, res) => {
    const data = req.body;
    const service = plex();

    if(data.activate) {
        // console.log("Enabling...")
        service.enable();
    } else {
        // console.log("Disabling...")
        service.disable();
    }

    // console.log("Status: ", service.status());

    res.send({ 
        status: "OK",
        message: service.status() 
    });
});

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

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})