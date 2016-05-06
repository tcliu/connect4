'use strict';

const port = process.argv[2] || 8000;
const express = require('express');
const app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
	res.redirect('/index.html');
});

app.use(express.static('./public'));

app.listen(port, () => {
	console.log('Server listening on port ' + port + ' ...');
});