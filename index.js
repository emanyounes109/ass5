const express = require('express');
const bootstrap = require('./src/app.controller');

const app = express();
bootstrap(app, express);
