const express = require("express");
const path = require("path")
const https = require("https");
const fs = require("fs");
const history = require("connect-history-api-fallback");
const jsonServer = require("json-server");
const bodyParser = require('body-parser');
const auth = require("./authMiddleware");
const router = jsonServer.router("serverdata.json");
const enableHttps = false;
const ssloptions = {}

if (enableHttps) {
    ssloptions.cert = fs.readFileSync("./ssl/sportsstore.crt");
    ssloptions.key = fs.readFileSync("./ssl/sportsstore.pem");
}
const app = express();
app.use(bodyParser.json());
app.use(auth);
app.use("/api", router);
app.use(history());
app.use("/", express.static("./dist/SportsStore"));
// Send all requests to index.html
app.get('/*', function (req, res) {
    res.sendFile(path.join("./dist/SportsStore/index.html"));
});
app.listen(process.env.PORT || 3000,
    () => console.log("HTTP Server running on port 80"));
if (enableHttps) {
    https.createServer(ssloptions, app).listen(443,
        () => console.log("HTTPS Server running on port 443"));
} else {
    console.log("HTTPS disabled")
}