const express = require("express");
let request = require("request");
const config = require("./config");
const app = express();
const port = 3000;

//Use the public folder to provide static content
app.use(express.static("public"));

//API to insert values to Dataset in Xibo
app.get("/sendDate", (request, response) => {
    let clientDateString = request.query.date;
    let clientTitleString = request.query.title;

    //If date parameter does not exist or isn't valid, send 400
    if (!clientTitleString || !clientDateString || isNaN(new Date(clientDateString).getTime())) {
        response.status(422).send({
            message: "Fill all the Fields"
        });
    } else {
        addRowToDataSet(clientDateString, clientTitleString);
        response.send({
            message: "Added Date to the DataSet"
        });
    }
});

//Let server listen
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//Get the access_token for xibo
async function requestToken() {
    let options = {
        method: "POST",
        url: `http://${config.XIBO_HOST}/api/authorize/access_token`,
        headers: {
            "content-type": "multipart/form-data"
        },
        formData: {
            client_id: config.CLIENT_ID,
            client_secret: config.CLIENT_SECRET,
            grant_type: "client_credentials"
        }
    };

    return JSON.parse(await promiseRequest(options)).access_token;
}

//Add a row to the DataSet with user Date and title
async function addRowToDataSet(dateString, titleString) {
    let headers = {
        "Authorization": `Bearer ${await requestToken()}`,
        "content-type": "application/x-www-form-urlencoded"
    };

    let columnIds = await getColumnIds({
        method: "GET",
        url: `http://${config.XIBO_HOST}/api/dataset/${config.DATA_SET_ID}/column`,
        headers,
    });

    let formData = {};
    formData["dataSetColumnId_" + columnIds[0]] = dateString;
    formData["dataSetColumnId_" + columnIds[1]] = titleString;

    let options = {
        method: "POST",
        url: `http://${config.XIBO_HOST}/api/dataset/data/${config.DATA_SET_ID}`,
        headers,
        formData
    };

    await promiseRequest(options);
}

//Everytime a dataset is created it gets new column Ids. Get the 2 dynamic column-ids as array
async function getColumnIds(options) {
    let response = JSON.parse(await promiseRequest(options));

    let columnIds = [];
    for (let column of response) {
        columnIds.push(column.dataSetColumnId);
    }

    return columnIds;
}

//Custom request function with promise based on 'request'
function promiseRequest(options) {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) reject(new Error(error));
            resolve(body);
        })
    });
}