'use strict';
const logger = require('../config/log4js_config');
const Token = require('../services/encryptToken_service');

exports.token = async (req, res) => {
    try {
        let transactionId = req.headers.transaction_id;
        logger.addContext('transaction_id', transactionId);

        let headers = req.headers;
        let body = req.body;
        let payload = body.data.token.payload;

        let token = new Token();

        try {
            await token.validarRequest(headers, body);
            let payloadValido = token.validarPayload(payload);

            // Valida respuesta de metodo validar payload
            if (!payloadValido) {
                res.status(422).json({
                    code: '422',
                    message: 'Payload no contiene propiedades'
                });
            } else {
                let tokenGenerado = token.generarToken(payload);
                let tokenEncriptado = token.encriptarToken(tokenGenerado);

                res.json({
                    data: {
                        encrypted_token: tokenEncriptado
                    }
                });
            }
        } catch (err) {
            // Obteniendo datos de objeto error
            let status = err.status;
            let code = err.code;
            let message = err.message;

            // Devolviendo respuesta error
            return res.status(status).json({
                code,
                message
            });
        }
    } catch (err) {
        logger.error('Ha ocurrido un error en metodo Generate Encrypt Token Controller: ', err);
        return res.status(500).json({
            code: '500',
            message: 'Internal Server Error'
        });
    }
};
