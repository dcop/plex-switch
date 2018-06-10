const express = require('express');
const app = express();
const plex = require('./plex');


app.get("/", (req, res) => {
    res.send("Hello world!")
});

app.get("/api/plex/:action", (req, res) => {
    const action = req.params.action;
    const fn = plex();
    
    fn[action]()
        .then(data => {
            res.json({
                "status": 'OK',
                "message": data
            });
        })
        .catch(error => {
            res.status(500).json({
                "status": 'KO',
                "message": error
            });
        });    
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
})