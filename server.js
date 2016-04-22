'use strict';

const port = process.argv[2] || 1000;
const express = require('express');
const app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
	res.redirect('/connect4.html');
});

app.use(express.static('.'));

app.listen(port, () => {
	console.log('Example app listening on port ' + port + '!');
});