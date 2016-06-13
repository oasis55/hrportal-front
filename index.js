var express = require('express');
var app = express();

app.use('/', express.static(__dirname));
app.listen(3555, function () {
    console.log('Example app listening on port 3555!');
});