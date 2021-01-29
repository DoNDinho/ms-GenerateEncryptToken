'use strict';
const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const bodyParser = require('body-parser');
const logger = require('./config/log4js_config');
const router = require('./routes/encryptToken_routes');

// Configurando bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurando rutas
app.use(router);

// Iniciando servidor
app.listen(PORT, () => {
    logger.info('Servidor en puerto ', PORT);
    logger.info('Firma Token: ', process.env.FIRMATOKENJWT);
    logger.info('Duracion Token: ', process.env.DURACIONTOKENJWT);
    logger.info('Firma JWE: ', process.env.FIRMATOKENJWE);
});
