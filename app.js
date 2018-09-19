const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');
const db = require('./database');

const app = express();

db.connect();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(cors());
app.use('/', routes);

app.listen(2400, () => console.log('Listening'));