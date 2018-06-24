const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

const username = "omk_dk";
const password = "1qaz2wsx3edc";

var url = `mongodb+srv://omk_dk:1qaz2wsx3edc@cluster0-xqfbc.mongodb.net/test`;

mongoose.connect(url);

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);

const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("Server is running on port " + port);