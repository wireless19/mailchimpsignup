//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: true
}));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us7.api.mailchimp.com/3.0/lists/8c36495c1a";

    const options = {
        method: "POST",
        auth: "victor1:fddc50232458af2b379546e79363e7bb-us7"
    }

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});



app.post("/failure", function (req, res) {
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});


// Mailchimp API Key
// fddc50232458af2b379546e79363e7bb-us7

// Audience or List ID: it help mailchimp to identify the list you want to put your subscribers into
// 8c36495c1a