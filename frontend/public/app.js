const express = require('express');
const server = express();

server.use(express.static("/home/site/wwwroot"));

server.get('/*', function (req, res) {
    res.sendFile("/home/site/wwwroot/index.html");
});
server.listen(process.env.PORT);