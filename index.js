const express = require("express");
const app = express();
const port = 3000;

//Use the public folder to provide static content
app.use(express.static("public"));

//Respond with index.html when a GET request is made to the homepage
app.get("/", (req, res) => res.sendFile("index.html"));

//API to insert values to Dataset in Xibo
app.get("/sendDate", (request, response) => {
    let clientDateString = request.query.date;

    //If date parameter does not exist or isn't valid, send 400
    if (!clientDateString || isNaN(new Date(clientDateString).getTime())) {
        console.log("Kein Parameter oder falscher string");
        response.sendStatus(400);
    } else {
        //TODO: Request Xibo
        response.send(request.query.date + " from server to the client");
    }
});

//Let server listen
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
